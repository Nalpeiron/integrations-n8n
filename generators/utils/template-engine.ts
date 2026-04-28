import * as fs from 'fs/promises';
import * as path from 'path';
import { NameConverter } from './name-converter';
import type {
	GeneratedResource,
	ResourceOperation,
	OperationParameter,
} from '../types/generator-types';

export class TemplateEngine {
	private nameConverter: NameConverter;

	constructor() {
		this.nameConverter = new NameConverter();
	}

	async renderHandler(resource: GeneratedResource): Promise<string> {
		const template = await this.loadTemplate('handler.template.ts');

		const context = {
			resource,
			imports: this.generateHandlerImports(resource),
			className: resource.handlerClassName,
			operations: this.generateOperationCases(resource),
			methods: this.generateHandlerMethods(resource),
		};

		return this.replaceTemplate(template, context);
	}

	async renderProperties(resource: GeneratedResource): Promise<string> {
		const template = await this.loadTemplate('properties.template.ts');

		const context = {
			resource,
			exportName: resource.propertiesExportName,
			operationOptions: this.generateOperationOptions(resource),
			parameterFields: this.generateParameterFields(resource),
		};

		return this.replaceTemplate(template, context);
	}

	private async loadTemplate(templateName: string): Promise<string> {
		const templatePath = path.join(__dirname, '..', 'templates', templateName);
		return await fs.readFile(templatePath, 'utf-8');
	}

	private generateHandlerImports(resource: GeneratedResource): string {
		// Check if any operation needs IDataObject (for query params, list operations, or request bodies)
		const needsIDataObject = resource.operations.some(
			(op) =>
				op.parameters.some((p) => p.location === 'query') ||
				op.isListOperation ||
				op.hasRequestBody,
		);

		const imports = needsIDataObject
			? `import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';`
			: `import type { IExecuteFunctions } from 'n8n-workflow';`;

		return `${imports}
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest } from '../../../shared/utils';`;
	}

	private generateOperationCases(resource: GeneratedResource): string {
		const operationMethods = this.createUniqueMethodNames(resource);

		return resource.operations
			.map((op) => {
				const methodName = operationMethods.get(op.name) || 'handleUnknown';
				return `\t\t\tcase '${op.name}':\n\t\t\t\treturn this.${methodName}(executeFunctions, itemIndex);`;
			})
			.join('\n');
	}

	private generateHandlerMethods(resource: GeneratedResource): string {
		const operationMethods = this.createUniqueMethodNames(resource);

		return resource.operations
			.map((operation) => {
				const methodName = operationMethods.get(operation.name) || 'handleUnknown';
				return this.generateHandlerMethod(resource, operation, methodName);
			})
			.join('\n\n');
	}

	private generateHandlerMethod(
		resource: GeneratedResource,
		operation: ResourceOperation,
		methodName?: string,
	): string {
		const finalMethodName =
			methodName || this.nameConverter.toMethodName(operation.name, resource.name);
		const pathParams = operation.parameters.filter((p) => p.location === 'path');
		const queryParams = operation.parameters.filter((p) => p.location === 'query');

		let method = `\tprivate async ${finalMethodName}(\n`;
		method += `\t\texecuteFunctions: IExecuteFunctions,\n`;
		method += `\t\titemIndex: number,\n`;
		method += `\t): Promise<unknown> {\n`;

		// Extract path parameters
		if (pathParams.length > 0) {
			for (const param of pathParams) {
				method += `\t\tconst ${param.name} = this.getNodeParameter(executeFunctions, '${param.name}', itemIndex) as string;\n`;
			}
			method += '\n';
		}

		// Handle query parameters for list operations
		if (queryParams.length > 0 || operation.isListOperation) {
			method += `\t\tconst additionalFields = this.getNodeParameter(\n`;
			method += `\t\t\texecuteFunctions,\n`;
			method += `\t\t\t'additionalFields',\n`;
			method += `\t\t\titemIndex,\n`;
			method += `\t\t\t{},\n`;
			method += `\t\t) as IDataObject;\n\n`;
		}

		// Handle request body for write operations
		if (operation.hasRequestBody) {
			if ((operation.requestBodyParameters || []).length > 0) {
				const requiredBodyParameters = (operation.requestBodyParameters || []).filter(
					(parameter) => parameter.required,
				);
				const optionalBodyParameters = (operation.requestBodyParameters || []).filter(
					(parameter) => !parameter.required,
				);
				const optionalFixedCollectionParameters = optionalBodyParameters.filter(
					(parameter) => parameter.type === 'fixedCollection',
				);
				const optionalArrayParameters = optionalBodyParameters.filter((parameter) =>
					this.shouldConvertParameterToArray(parameter),
				);

				method += `\t\tconst useRawJson = this.getNodeParameter(\n`;
				method += `\t\t\texecuteFunctions,\n`;
				method += `\t\t\t'useRawJson',\n`;
				method += `\t\t\titemIndex,\n`;
				method += `\t\t\tfalse,\n`;
				method += `\t\t) as boolean;\n\n`;
				method += `\t\tconst nodeParameters = executeFunctions.getNode().parameters as IDataObject;\n`;
				method += `\t\tconst hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(\n`;
				method += `\t\t\tnodeParameters,\n`;
				method += `\t\t\t'requestBody',\n`;
				method += `\t\t);\n\n`;
				method += `\t\tlet finalRequestBody: IDataObject = {};\n`;
				method += `\t\tif (useRawJson || hasPersistedRequestBody) {\n`;
				method += `\t\t\tfinalRequestBody = this.getNodeParameter(\n`;
				method += `\t\t\t\texecuteFunctions,\n`;
				method += `\t\t\t\t'requestBody',\n`;
				method += `\t\t\t\titemIndex,\n`;
				method += `\t\t\t\t{},\n`;
				method += `\t\t\t) as IDataObject;\n`;
				method += `\t\t} else {\n`;
				method += `\t\t\tconst bodyFromFields: IDataObject = {};\n`;

				if (requiredBodyParameters.length > 0) {
					method += '\n';
					for (const parameter of requiredBodyParameters) {
						const requiredPropertyName = this.getRequiredBodyPropertyName(
							resource.name,
							operation.name,
							parameter.name,
						);
						const valueVariableName = `${requiredPropertyName}Value`;
						method += `\t\t\tconst ${valueVariableName} = this.getNodeParameter(\n`;
						method += `\t\t\t\texecuteFunctions,\n`;
						method += `\t\t\t\t'${requiredPropertyName}',\n`;
						method += `\t\t\t\titemIndex,\n`;
						method += `\t\t\t) as ${this.getNodeParameterCastType(parameter)};\n`;
						if (parameter.type === 'fixedCollection') {
							method += `\t\t\tbodyFromFields['${parameter.name}'] = this.convertFixedCollectionToObject(${valueVariableName});\n`;
						} else if (parameter.type === 'collection') {
							const schemaLiteral = this.serializeSchemaForCode(parameter.schema);
							method += `\t\t\tbodyFromFields['${parameter.name}'] = this.applySchemaDefaultsToObject(${valueVariableName}, ${schemaLiteral} as IDataObject);\n`;
						} else if (this.shouldConvertParameterToArray(parameter)) {
							method += `\t\t\tbodyFromFields['${parameter.name}'] = this.convertFixedCollectionToArray(${valueVariableName});\n`;
						} else {
							method += `\t\t\tbodyFromFields['${parameter.name}'] = ${valueVariableName};\n`;
						}
					}
				}

				if (optionalBodyParameters.length > 0) {
					method += `\n\t\t\tconst requestBodyAdditionalFields = this.getNodeParameter(\n`;
					method += `\t\t\t\texecuteFunctions,\n`;
					method += `\t\t\t\t'additionalFields',\n`;
					method += `\t\t\t\titemIndex,\n`;
					method += `\t\t\t\t{},\n`;
					method += `\t\t\t) as IDataObject;\n`;
					method += `\t\t\tObject.assign(bodyFromFields, requestBodyAdditionalFields);\n`;
					for (const parameter of optionalFixedCollectionParameters) {
						method += `\t\t\tif (requestBodyAdditionalFields['${parameter.name}']) {\n`;
						method += `\t\t\t\tbodyFromFields['${parameter.name}'] = this.convertFixedCollectionToObject(\n`;
						method += `\t\t\t\t\trequestBodyAdditionalFields['${parameter.name}'] as IDataObject,\n`;
						method += `\t\t\t\t);\n`;
						method += `\t\t\t}\n`;
					}
					for (const parameter of optionalArrayParameters) {
						method += `\t\t\tif (requestBodyAdditionalFields['${parameter.name}']) {\n`;
						method += `\t\t\t\tbodyFromFields['${parameter.name}'] = this.convertFixedCollectionToArray(\n`;
						method += `\t\t\t\t\trequestBodyAdditionalFields['${parameter.name}'] as IDataObject,\n`;
						method += `\t\t\t\t);\n`;
						method += `\t\t\t}\n`;
					}
				}

				method += `\n\t\t\tfinalRequestBody = bodyFromFields;\n`;
				method += `\t\t}\n\n`;
			} else {
				method += `\t\tconst finalRequestBody = this.getNodeParameter(\n`;
				method += `\t\t\texecuteFunctions,\n`;
				method += `\t\t\t'requestBody',\n`;
				method += `\t\t\titemIndex,\n`;
				method += `\t\t\t{},\n`;
				method += `\t\t) as IDataObject;\n\n`;
			}
		}

		// Build the API path
		let apiPath = operation.path;
		if (!apiPath.startsWith('/api/v1')) {
			apiPath = '/api/v1' + apiPath;
		}

		// Replace path parameters
		for (const param of pathParams) {
			apiPath = apiPath.replace(`{${param.name}}`, `\${${param.name}}`);
		}

		method += `\t\treturn await makeAuthenticatedRequest(\n`;
		method += `\t\t\texecuteFunctions,\n`;
		method += `\t\t\t'${operation.method}',\n`;
		method += `\t\t\t\`${apiPath}\`,\n`;

		// Add body parameter for write operations
		if (operation.hasRequestBody) {
			method += `\t\t\tfinalRequestBody,\n`;
		} else {
			method += `\t\t\tundefined,\n`;
		}

		// Add query parameters for list operations
		if (queryParams.length > 0 || operation.isListOperation) {
			method += `\t\t\tadditionalFields,\n`;
		}

		method += `\t\t);\n`;
		method += `\t}`;

		return method;
	}

	private generateOperationOptions(resource: GeneratedResource): string {
		// Sort operations alphabetically by display name for ESLint compliance
		const sortedOperations = resource.operations
			.map((operation) => ({
				operation,
				displayName: operation.displayName,
				action: this.nameConverter.toOperationAction(operation.displayName),
				sanitizedDescription: this.sanitizeDescription(operation.description),
			}))
			.sort((a, b) => a.displayName.localeCompare(b.displayName));

		return sortedOperations
			.map(({ operation, displayName, action, sanitizedDescription }) => {
				return `\t\t\t{\n\t\t\t\tname: '${displayName}',\n\t\t\t\tvalue: '${operation.name}',\n\t\t\t\tdescription: '${sanitizedDescription}',\n\t\t\t\taction: '${action}',\n\t\t\t},`;
			})
			.join('\n');
	}

	private generateParameterFields(resource: GeneratedResource): string {
		const fields: string[] = [];

		// Collect all unique parameters across operations
		const allParameters = new Map<string, OperationParameter>();
		const operationParameters = new Map<string, Set<string>>();

		for (const operation of resource.operations) {
			operationParameters.set(operation.name, new Set());

			for (const param of operation.parameters) {
				allParameters.set(param.name, param);
				operationParameters.get(operation.name)!.add(param.name);
			}
		}

		// Generate fields for each parameter
		for (const [paramName, param] of allParameters) {
			const operationsUsingParam = Array.from(operationParameters.entries())
				.filter(([_, params]) => params.has(paramName))
				.map(([op, _]) => op);

			if (param.location === 'path') {
				fields.push(this.generatePathParameterField(resource, param, operationsUsingParam));
			}
		}

		// Add additionalFields collection for list operations
		const listOperations = resource.operations.filter((op) => op.isListOperation);
		if (listOperations.length > 0) {
			fields.push(this.generateAdditionalFieldsCollection(resource, listOperations));
		}

		// Add additionalFields for create/update operations
		const writeOperations = resource.operations.filter((op) => op.hasRequestBody);
		if (writeOperations.length > 0) {
			fields.push(this.generateWriteOperationFields(resource, writeOperations));
		}

		return fields.join('\n');
	}

	private generatePathParameterField(
		resource: GeneratedResource,
		param: OperationParameter,
		operations: string[],
	): string {
		const description = this.formatDescription(param.description, param.type);

		return `\t// ${param.displayName} parameter
\t{
\t\tdisplayName: '${param.displayName}',
\t\tname: '${param.name}',
\t\ttype: '${param.type}',
\t\trequired: ${param.required},
\t\tdisplayOptions: {
\t\t\tshow: {
\t\t\t\tresource: ['${resource.name}'],
\t\t\t\toperation: [${operations.map((op) => `'${op}'`).join(', ')}],
\t\t\t},
\t\t},
\t\tdefault: '',
\t\tdescription: '${this.sanitizeDescription(description)}',
\t},`;
	}

	private generateAdditionalFieldsCollection(
		resource: GeneratedResource,
		listOperations: ResourceOperation[],
	): string {
		const operationNames = listOperations.map((op) => `'${op.name}'`).join(', ');

		// Collect query parameters from list operations
		const queryParams = new Set<OperationParameter>();
		for (const operation of listOperations) {
			for (const param of operation.parameters) {
				if (param.location === 'query') {
					queryParams.add(param);
				}
			}
		}

		// Combine query parameters with standard pagination options
		const allOptions: Array<{ displayName: string; content: string }> = [];

		// Add query parameters from API
		for (const param of queryParams) {
			allOptions.push({
				displayName: param.displayName,
				content: this.generateQueryParameterOption(param),
			});
		}

		// Always add pagination options if not already present
		const hasPageNumber = Array.from(queryParams).some((p) => p.name === 'pageNumber');
		const hasPageSize = Array.from(queryParams).some((p) => p.name === 'pageSize');

		if (!hasPageNumber) {
			allOptions.push({
				displayName: 'Page Number',
				content: `\t\t\t{
\t\t\t\tdisplayName: 'Page Number',
\t\t\t\tname: 'pageNumber',
\t\t\t\ttype: 'number',
\t\t\t\ttypeOptions: {
\t\t\t\t\tminValue: 1,
\t\t\t\t},
\t\t\t\tdefault: 1,
\t\t\t\tdescription: 'Requested page number',
\t\t\t},`,
			});
		}

		if (!hasPageSize) {
			allOptions.push({
				displayName: 'Page Size',
				content: `\t\t\t{
\t\t\t\tdisplayName: 'Page Size',
\t\t\t\tname: 'pageSize',
\t\t\t\ttype: 'number',
\t\t\t\ttypeOptions: {
\t\t\t\t\tminValue: 1,
\t\t\t\t},
\t\t\t\tdefault: 10,
\t\t\t\tdescription: 'Maximum number of items per page',
\t\t\t},`,
			});
		}

		// Sort all options alphabetically by displayName
		const options = allOptions
			.sort((a, b) => a.displayName.localeCompare(b.displayName))
			.map((option) => option.content)
			.join('\n');

		return `\t// Additional fields for list operations
\t{
\t\tdisplayName: 'Additional Fields',
\t\tname: 'additionalFields',
\t\ttype: 'collection',
\t\tplaceholder: 'Add Field',
\t\tdefault: {},
\t\tdisplayOptions: {
\t\t\tshow: {
\t\t\t\tresource: ['${resource.name}'],
\t\t\t\toperation: [${operationNames}],
\t\t\t},
\t\t},
\t\toptions: [
${options}
\t\t],
\t},`;
	}

	private generateQueryParameterOption(param: OperationParameter): string {
		const description = this.formatDescription(param.description, param.type);

		return `\t\t\t{
\t\t\t\tdisplayName: '${param.displayName}',
\t\t\t\tname: '${param.name}',
\t\t\t\ttype: '${param.type}',
\t\t\t\tdefault: '',
\t\t\t\tdescription: '${this.sanitizeDescription(description)}',
\t\t\t},`;
	}

	private generateWriteOperationFields(
		resource: GeneratedResource,
		writeOperations: ResourceOperation[],
	): string {
		const operationsWithBasicFields = writeOperations.filter(
			(operation) => (operation.requestBodyParameters || []).length > 0,
		);
		const operationsWithoutBasicFields = writeOperations.filter(
			(operation) => (operation.requestBodyParameters || []).length === 0,
		);

		const sections: string[] = [];

		if (operationsWithBasicFields.length > 0) {
			sections.push(this.generateRequiredRequestBodyFields(resource, operationsWithBasicFields));
			sections.push(
				...this.generateOptionalRequestBodyFieldsCollections(resource, operationsWithBasicFields),
			);
			sections.push(this.generateBodyModeField(resource, operationsWithBasicFields));
			sections.push(this.generateRawRequestBodyField(resource, operationsWithBasicFields, true));
		}

		if (operationsWithoutBasicFields.length > 0) {
			sections.push(
				this.generateRawRequestBodyField(resource, operationsWithoutBasicFields, false),
			);
		}

		return sections.join('\n');
	}

	private generateBodyModeField(
		resource: GeneratedResource,
		operations: ResourceOperation[],
	): string {
		const operationNames = operations.map((op) => `'${op.name}'`).join(', ');

		return `\t// Raw JSON toggle for create/update operations
\t{
\t\tdisplayName: 'Raw JSON',
\t\tname: 'useRawJson',
\t\ttype: 'boolean',
\t\tdefault: false,
\t\tdisplayOptions: {
\t\t\tshow: {
\t\t\t\tresource: ['${resource.name}'],
\t\t\t\toperation: [${operationNames}],
\t\t\t},
\t\t},
\t\tdescription: 'Whether to enter the request body as raw JSON',
\t},`;
	}

	private generateRequiredRequestBodyFields(
		resource: GeneratedResource,
		operations: ResourceOperation[],
	): string {
		const fields: string[] = [];

		for (const operation of operations) {
			const requiredParameters = (operation.requestBodyParameters || [])
				.filter((parameter) => parameter.required)
				.sort((a, b) => this.compareRequestBodyParameters(a, b));

			for (const parameter of requiredParameters) {
				fields.push(this.generateRequiredRequestBodyField(resource, operation.name, parameter));
			}
		}

		return fields.join('\n');
	}

	private generateRequiredRequestBodyField(
		resource: GeneratedResource,
		operationName: string,
		parameter: OperationParameter,
	): string {
		const description = this.formatDescription(parameter.description, parameter.type);
		const defaultValue = this.getParameterDefaultValue(parameter);
		const operationNames = `'${operationName}'`;
		const parameterName = this.getRequiredBodyPropertyName(
			resource.name,
			operationName,
			parameter.name,
		);

		if (this.shouldConvertParameterToArray(parameter)) {
			return this.generateRequiredArrayRequestBodyField(
				resource,
				parameter,
				parameterName,
				operationNames,
				description,
			);
		}

		if (parameter.type === 'options' && parameter.enum && parameter.enum.length > 0) {
			const sortedEnumValues = [...parameter.enum].sort((a, b) =>
				a.localeCompare(b, undefined, { sensitivity: 'base' }),
			);
			const enumOptions = sortedEnumValues
				.map((value) => {
					const displayValue = this.nameConverter.toDisplayName(value);
					return `\t\t\t{\n\t\t\t\tname: '${displayValue}',\n\t\t\t\tvalue: '${value}',\n\t\t\t},`;
				})
				.join('\n');

			return `\t// Required field: ${parameter.displayName}
\t{
\t\tdisplayName: '${parameter.displayName}',
\t\tname: '${parameterName}',
\t\ttype: 'options',
\t\trequired: true,
\t\tdefault: ${defaultValue},
\t\tdisplayOptions: {
\t\t\tshow: {
\t\t\t\tresource: ['${resource.name}'],
\t\t\t\toperation: [${operationNames}],
\t\t\t\tuseRawJson: [false],
\t\t\t},
\t\t},
\t\toptions: [
${enumOptions}
\t\t],
\t\tdescription: '${this.sanitizeDescription(description)}',
\t},`;
		}

		if (parameter.type === 'fixedCollection') {
			const fixedCollectionOptions = this.generateFixedCollectionEntryValues(
				parameter.mapValueSchema,
				'\t\t\t',
			);

			return `\t// Required field: ${parameter.displayName}
\t{
\t\tdisplayName: '${parameter.displayName}',
\t\tname: '${parameterName}',
\t\ttype: 'fixedCollection',
\t\trequired: true,
\t\tdefault: {},
\t\ttypeOptions: {
\t\t\tmultipleValues: true,
\t\t},
\t\tdisplayOptions: {
\t\t\tshow: {
\t\t\t\tresource: ['${resource.name}'],
\t\t\t\toperation: [${operationNames}],
\t\t\t\tuseRawJson: [false],
\t\t\t},
\t\t},
\t\toptions: [
\t\t\t{
\t\t\t\tdisplayName: 'Field',
\t\t\t\tname: 'entries',
\t\t\t\tvalues: [
${fixedCollectionOptions}
\t\t\t\t],
\t\t\t},
\t\t],
\t\tdescription: '${this.sanitizeDescription(description)}',
\t},`;
		}

		if (parameter.type === 'collection' && parameter.schema?.properties) {
			const collectionOptions = this.generateCollectionFieldOptions(
				parameter.schema,
				'\t\t\t',
				true,
			);
			const collectionDefaultValue = this.getRequiredCollectionDefaultValue(parameter.schema);

			return `\t// Required field: ${parameter.displayName}
\t{
\t\tdisplayName: '${parameter.displayName}',
\t\tname: '${parameterName}',
\t\ttype: 'collection',
\t\trequired: true,
\t\tdefault: ${collectionDefaultValue},
\t\tplaceholder: 'Add Field',
\t\tdisplayOptions: {
\t\t\tshow: {
\t\t\t\tresource: ['${resource.name}'],
\t\t\t\toperation: [${operationNames}],
\t\t\t\tuseRawJson: [false],
\t\t\t},
\t\t},
\t\toptions: [
${collectionOptions}
\t\t],
\t\tdescription: '${this.sanitizeDescription(description)}',
\t},`;
		}

		return `\t// Required field: ${parameter.displayName}
\t{
\t\tdisplayName: '${parameter.displayName}',
\t\tname: '${parameterName}',
\t\ttype: '${parameter.type}',
\t\trequired: true,
\t\tdefault: ${defaultValue},
\t\tdisplayOptions: {
\t\t\tshow: {
\t\t\t\tresource: ['${resource.name}'],
\t\t\t\toperation: [${operationNames}],
\t\t\t\tuseRawJson: [false],
\t\t\t},
\t\t},
\t\tdescription: '${this.sanitizeDescription(description)}',
\t},`;
	}

	private generateOptionalRequestBodyFieldsCollections(
		resource: GeneratedResource,
		operations: ResourceOperation[],
	): string[] {
		const collections: string[] = [];

		for (const operation of operations) {
			const optionalParameters = (operation.requestBodyParameters || [])
				.filter((parameter) => !parameter.required)
				.sort((a, b) => this.compareRequestBodyParameters(a, b));

			if (optionalParameters.length === 0) {
				continue;
			}

			const options = optionalParameters
				.map((parameter) => this.generateRequestBodyFieldOption(parameter))
				.join('\n');

			collections.push(`\t// Optional request body fields for ${operation.displayName}
\t{
\t\tdisplayName: 'Additional Fields',
\t\tname: 'additionalFields',
\t\ttype: 'collection',
\t\tplaceholder: 'Add Field',
\t\tdefault: {},
\t\tdisplayOptions: {
\t\t\tshow: {
\t\t\t\tresource: ['${resource.name}'],
\t\t\t\toperation: ['${operation.name}'],
\t\t\t\tuseRawJson: [false],
\t\t\t},
\t\t},
\t\toptions: [
${options}
\t\t],
\t\tdescription: 'Optional request body fields',
\t},`);
		}

		return collections;
	}

	private generateRequestBodyFieldOption(parameter: OperationParameter): string {
		const description = this.formatDescription(parameter.description, parameter.type);
		const defaultValue = this.getParameterDefaultValue(parameter);
		const sanitizedDisplayName = this.sanitizeDescription(parameter.displayName);

		if (this.shouldConvertParameterToArray(parameter)) {
			return this.generateArrayRequestBodyFieldOption(parameter, sanitizedDisplayName, description);
		}

		if (parameter.type === 'options' && parameter.enum && parameter.enum.length > 0) {
			const sortedEnumValues = [...parameter.enum].sort((a, b) =>
				a.localeCompare(b, undefined, { sensitivity: 'base' }),
			);
			const enumOptions = sortedEnumValues
				.map((value) => {
					const displayValue = this.nameConverter.toDisplayName(value);
					return `\t\t\t\t\t{\n\t\t\t\t\t\tname: '${displayValue}',\n\t\t\t\t\t\tvalue: '${value}',\n\t\t\t\t\t},`;
				})
				.join('\n');

			return `\t\t\t{
\t\t\t\tdisplayName: '${sanitizedDisplayName}',
\t\t\t\tname: '${parameter.name}',
\t\t\t\ttype: 'options',
\t\t\t\trequired: ${parameter.required},
\t\t\t\tdefault: ${defaultValue},
\t\t\t\toptions: [
${enumOptions}
\t\t\t\t],
\t\t\t\tdescription: '${this.sanitizeDescription(description)}',
\t\t\t},`;
		}

		if (parameter.type === 'fixedCollection') {
			const fixedCollectionOptions = this.generateFixedCollectionEntryValues(
				parameter.mapValueSchema,
				'\t\t\t\t\t',
			);

			return `\t\t\t{
\t\t\t\tdisplayName: '${sanitizedDisplayName}',
\t\t\t\tname: '${parameter.name}',
\t\t\t\ttype: 'fixedCollection',
\t\t\t\trequired: ${parameter.required},
\t\t\t\tdefault: {},
\t\t\t\ttypeOptions: {
\t\t\t\t\tmultipleValues: true,
\t\t\t\t},
\t\t\t\toptions: [
\t\t\t\t\t{
\t\t\t\t\t\tdisplayName: 'Field',
\t\t\t\t\t\tname: 'entries',
\t\t\t\t\t\tvalues: [
${fixedCollectionOptions}
\t\t\t\t\t\t],
\t\t\t\t\t},
\t\t\t\t],
\t\t\t\tdescription: '${this.sanitizeDescription(description)}',
\t\t\t},`;
		}

		if (parameter.type === 'collection' && parameter.schema?.properties) {
			const collectionOptions = this.generateCollectionFieldOptions(parameter.schema, '\t\t\t\t\t');

			return `\t\t\t{
\t\t\t\tdisplayName: '${sanitizedDisplayName}',
\t\t\t\tname: '${parameter.name}',
\t\t\t\ttype: 'collection',
\t\t\t\trequired: ${parameter.required},
\t\t\t\tdefault: {},
\t\t\t\tplaceholder: 'Add Field',
\t\t\t\toptions: [
${collectionOptions}
\t\t\t\t],
\t\t\t\tdescription: '${this.sanitizeDescription(description)}',
\t\t\t},`;
		}

		return `\t\t\t{
\t\t\t\tdisplayName: '${sanitizedDisplayName}',
\t\t\t\tname: '${parameter.name}',
\t\t\t\ttype: '${parameter.type}',
\t\t\t\trequired: ${parameter.required},
\t\t\t\tdefault: ${defaultValue},
\t\t\t\tdescription: '${this.sanitizeDescription(description)}',
\t\t\t},`;
	}

	private getParameterDefaultValue(parameter: OperationParameter): string {
		if (parameter.default !== undefined && parameter.default !== null) {
			return JSON.stringify(parameter.default);
		}

		if (parameter.type === 'boolean') {
			return 'false';
		}

		if (parameter.type === 'number') {
			return '0';
		}

		if (parameter.type === 'collection') {
			return '{}';
		}

		if (parameter.type === 'fixedCollection') {
			return '{}';
		}

		if (parameter.type === 'json') {
			return `'{}'`;
		}

		if (parameter.type === 'options' && parameter.enum && parameter.enum.length > 0) {
			return JSON.stringify(parameter.enum[0]);
		}

		return `''`;
	}

	private generateRawRequestBodyField(
		resource: GeneratedResource,
		operations: ResourceOperation[],
		withBodyModeFilter: boolean,
	): string {
		const operationNames = operations.map((op) => `'${op.name}'`).join(', ');
		const rawJsonFilter = withBodyModeFilter ? `\n\t\t\t\tuseRawJson: [true],` : '';

		return `\t// Raw request body JSON for create/update operations
\t{
\t\tdisplayName: 'Request Body',
\t\tname: 'requestBody',
\t\ttype: 'json',
\t\tdefault: '{}',
\t\tdisplayOptions: {
\t\t\tshow: {
\t\t\t\tresource: ['${resource.name}'],
\t\t\t\toperation: [${operationNames}],${rawJsonFilter}
\t\t\t},
\t\t},
\t\tdescription: 'Request body data as JSON object',
\t},`;
	}

	private replaceTemplate(template: string, context: any): string {
		let result = template;

		// Replace all context variables
		for (const [key, value] of Object.entries(context)) {
			const placeholder = `{{${key}}}`;
			result = result.replace(new RegExp(placeholder, 'g'), String(value));
		}

		// Handle nested object properties
		result = result.replace(/\{\{resource\.(\w+)\}\}/g, (match, property) => {
			if (context.resource && context.resource[property] !== undefined) {
				return String(context.resource[property]);
			}
			return match;
		});

		// Handle array access like {{resource.operations.0.name}}
		result = result.replace(/\{\{resource\.operations\.0\.name\}\}/g, () => {
			if (context.resource && context.resource.operations && context.resource.operations[0]) {
				return context.resource.operations[0].name;
			}
			return 'get';
		});

		return result;
	}

	/**
	 * Create unique method names for operations to avoid conflicts
	 */
	private createUniqueMethodNames(resource: GeneratedResource): Map<string, string> {
		const methodNames = new Map<string, string>();
		const usedNames = new Set<string>();

		for (const operation of resource.operations) {
			let baseMethodName = this.nameConverter.toMethodName(operation.name, resource.name);

			// Sanitize the method name to ensure it's valid TypeScript
			baseMethodName =
				baseMethodName.replace(/[^a-zA-Z0-9_]/g, '').replace(/^[^a-zA-Z]+/, '') || 'operation';

			let uniqueMethodName = baseMethodName;
			let counter = 1;

			// Keep adding numbers until we get a unique name
			while (usedNames.has(uniqueMethodName)) {
				uniqueMethodName = `${baseMethodName}${counter}`;
				counter++;
			}

			usedNames.add(uniqueMethodName);
			methodNames.set(operation.name, uniqueMethodName);
		}

		return methodNames;
	}

	/**
	 * Format description according to n8n conventions
	 */
	private formatDescription(description: string, type?: string): string {
		if (!description) return '';

		// For boolean types, description should start with "Whether"
		if (type === 'boolean') {
			const cleanDesc = description.trim();
			if (!cleanDesc.toLowerCase().startsWith('whether')) {
				// Transform common boolean patterns
				if (cleanDesc.toLowerCase().startsWith('include ')) {
					return `Whether to ${cleanDesc.toLowerCase()}`;
				} else if (
					cleanDesc.toLowerCase().startsWith('enable ') ||
					cleanDesc.toLowerCase().startsWith('disable ')
				) {
					return `Whether to ${cleanDesc.toLowerCase()}`;
				} else {
					// Generic transformation
					return `Whether ${cleanDesc.toLowerCase()}`;
				}
			}
		}

		return description;
	}

	private getRequiredBodyPropertyName(
		_resourceName: string,
		_operationName: string,
		parameterName: string,
	): string {
		const safeParameterName = parameterName.replace(/[^a-zA-Z0-9]/g, '_');
		return `requiredBody_${safeParameterName}`;
	}

	private getNodeParameterCastType(parameter: OperationParameter): string {
		if (this.shouldConvertParameterToArray(parameter)) {
			return 'IDataObject';
		}

		if (parameter.type === 'boolean') {
			return 'boolean';
		}

		if (parameter.type === 'number') {
			return 'number';
		}

		if (parameter.type === 'collection') {
			return 'IDataObject';
		}

		if (parameter.type === 'fixedCollection') {
			return 'IDataObject';
		}

		if (parameter.type === 'json') {
			return 'IDataObject';
		}

		return 'string';
	}

	private serializeSchemaForCode(schema: any): string {
		if (!schema || typeof schema !== 'object') {
			return '{}';
		}

		return JSON.stringify(schema);
	}

	private shouldConvertParameterToArray(parameter: OperationParameter): boolean {
		if (parameter.location !== 'body') {
			return false;
		}

		return this.isPrimitiveArraySchema(parameter.schema);
	}

	private isPrimitiveArraySchema(schema: any): boolean {
		if (!schema || schema.type !== 'array') {
			return false;
		}

		const itemSchema = schema.items;
		if (!itemSchema || typeof itemSchema !== 'object') {
			return false;
		}

		if (Array.isArray(itemSchema.enum) && itemSchema.enum.length > 0) {
			return true;
		}

		return ['string', 'number', 'integer', 'boolean'].includes(itemSchema.type);
	}

	private mapArrayItemToN8NType(itemSchema: any): string {
		if (Array.isArray(itemSchema?.enum) && itemSchema.enum.length > 0) {
			return 'options';
		}

		switch (itemSchema?.type) {
			case 'number':
			case 'integer':
				return 'number';
			case 'boolean':
				return 'boolean';
			default:
				return 'string';
		}
	}

	private generateArrayFieldValueOption(itemSchema: any, fieldIndent: string): string {
		const fieldType = this.mapArrayItemToN8NType(itemSchema);
		const description = this.sanitizeDescription(
			this.formatDescription(itemSchema?.description || 'Array item value', fieldType),
		);
		const defaultValue = this.getSchemaDefaultValue(itemSchema, fieldType);

		if (fieldType === 'options' && Array.isArray(itemSchema?.enum) && itemSchema.enum.length > 0) {
			const enumOptions = [...itemSchema.enum]
				.map((value: unknown) => String(value))
				.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
				.map(
					(value) =>
						`${fieldIndent}\t{\n${fieldIndent}\t\tname: '${this.nameConverter.toDisplayName(
							value,
						)}',\n${fieldIndent}\t\tvalue: '${value}',\n${fieldIndent}\t},`,
				)
				.join('\n');

			return `${fieldIndent}{
${fieldIndent}\tdisplayName: 'Value',
${fieldIndent}\tname: 'value',
${fieldIndent}\ttype: 'options',
${fieldIndent}\tdefault: ${defaultValue},
${fieldIndent}\toptions: [
${enumOptions}
${fieldIndent}\t],
${fieldIndent}\tdescription: '${description}',
${fieldIndent}},`;
		}

		return `${fieldIndent}{
${fieldIndent}\tdisplayName: 'Value',
${fieldIndent}\tname: 'value',
${fieldIndent}\ttype: '${fieldType}',
${fieldIndent}\tdefault: ${defaultValue},
${fieldIndent}\tdescription: '${description}',
${fieldIndent}},`;
	}

	private generateRequiredArrayRequestBodyField(
		resource: GeneratedResource,
		parameter: OperationParameter,
		parameterName: string,
		operationNames: string,
		description: string,
	): string {
		const values = this.generateArrayFieldValueOption(parameter.schema?.items, '\t\t\t');

		return `\t// Required field: ${parameter.displayName}
\t{
\t\tdisplayName: '${parameter.displayName}',
\t\tname: '${parameterName}',
\t\ttype: 'fixedCollection',
\t\trequired: true,
\t\tdefault: {},
\t\ttypeOptions: {
\t\t\tmultipleValues: true,
\t\t},
\t\tdisplayOptions: {
\t\t\tshow: {
\t\t\t\tresource: ['${resource.name}'],
\t\t\t\toperation: [${operationNames}],
\t\t\t\tuseRawJson: [false],
\t\t\t},
\t\t},
\t\toptions: [
\t\t\t{
\t\t\t\tdisplayName: 'Field',
\t\t\t\tname: 'entries',
\t\t\t\tvalues: [
${values}
\t\t\t\t],
\t\t\t},
\t\t],
\t\tdescription: '${this.sanitizeDescription(description)}',
\t},`;
	}

	private generateArrayRequestBodyFieldOption(
		parameter: OperationParameter,
		sanitizedDisplayName: string,
		description: string,
	): string {
		const values = this.generateArrayFieldValueOption(parameter.schema?.items, '\t\t\t\t\t');

		return `\t\t\t{
\t\t\t\tdisplayName: '${sanitizedDisplayName}',
\t\t\t\tname: '${parameter.name}',
\t\t\t\ttype: 'fixedCollection',
\t\t\t\trequired: ${parameter.required},
\t\t\t\tdefault: {},
\t\t\t\ttypeOptions: {
\t\t\t\t\tmultipleValues: true,
\t\t\t\t},
\t\t\t\toptions: [
\t\t\t\t\t{
\t\t\t\t\t\tdisplayName: 'Field',
\t\t\t\t\t\tname: 'entries',
\t\t\t\t\t\tvalues: [
${values}
\t\t\t\t\t\t],
\t\t\t\t\t},
\t\t\t\t],
\t\t\t\tdescription: '${this.sanitizeDescription(description)}',
\t\t\t},`;
	}

	private generateCollectionFieldOptions(
		schema: any,
		itemIndent: string,
		respectRequired = false,
	): string {
		if (!schema?.properties || typeof schema.properties !== 'object') {
			return '';
		}

		const requiredFields = new Set<string>(Array.isArray(schema.required) ? schema.required : []);

		return Object.entries(schema.properties)
			.map(([fieldName, fieldSchema]) => ({
				fieldName,
				fieldSchema,
				required: respectRequired && requiredFields.has(fieldName),
			}))
			.sort((a, b) => a.fieldName.localeCompare(b.fieldName))
			.map(({ fieldName, fieldSchema, required }) =>
				this.generateCollectionFieldOption(
					fieldName,
					fieldSchema,
					required,
					itemIndent,
					respectRequired,
				),
			)
			.filter((entry): entry is string => Boolean(entry))
			.join('\n');
	}

	private generateCollectionFieldOption(
		fieldName: string,
		fieldSchema: any,
		required: boolean,
		itemIndent: string,
		respectRequired: boolean,
	): string | null {
		const fieldType = this.mapSchemaTypeToN8NFieldType(fieldSchema);
		if (!fieldType) {
			return null;
		}

		const displayName = this.sanitizeDescription(this.nameConverter.toDisplayName(fieldName));
		const description = this.sanitizeDescription(
			this.formatDescription(fieldSchema?.description || '', fieldType),
		);
		const defaultValue = this.getSchemaDefaultValue(fieldSchema, fieldType);

		if (
			fieldType === 'options' &&
			Array.isArray(fieldSchema?.enum) &&
			fieldSchema.enum.length > 0
		) {
			const enumOptions = [...fieldSchema.enum]
				.map((value: unknown) => String(value))
				.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
				.map(
					(value) =>
						`${itemIndent}\t\t{\n${itemIndent}\t\t\tname: '${this.nameConverter.toDisplayName(
							value,
						)}',\n${itemIndent}\t\t\tvalue: '${value}',\n${itemIndent}\t\t},`,
				)
				.join('\n');

			return `${itemIndent}{
${itemIndent}\tdisplayName: '${displayName}',
${itemIndent}\tname: '${fieldName}',
${itemIndent}\ttype: 'options',
${itemIndent}\tdefault: ${defaultValue},
${itemIndent}\toptions: [
${enumOptions}
${itemIndent}\t],
${itemIndent}\tdescription: '${description}',
${itemIndent}},`;
		}

		if (fieldType === 'collection' && fieldSchema?.properties) {
			const nestedOptions = this.generateCollectionFieldOptions(
				fieldSchema,
				`${itemIndent}\t\t`,
				respectRequired,
			);

			return `${itemIndent}{
${itemIndent}\tdisplayName: '${displayName}',
${itemIndent}\tname: '${fieldName}',
${itemIndent}\ttype: 'collection',
${itemIndent}\tdefault: {},
${itemIndent}\tplaceholder: 'Add Field',
${itemIndent}\toptions: [
${nestedOptions}
${itemIndent}\t],
${itemIndent}\tdescription: '${description}',
${itemIndent}},`;
		}

		if (fieldType === 'fixedCollection') {
			const fixedCollectionOptions = this.generateFixedCollectionEntryValues(
				fieldSchema?.additionalProperties,
				`${itemIndent}\t\t`,
			);

			return `${itemIndent}{
${itemIndent}\tdisplayName: '${displayName}',
${itemIndent}\tname: '${fieldName}',
${itemIndent}\ttype: 'fixedCollection',
${itemIndent}\tdefault: {},
${itemIndent}\ttypeOptions: {
${itemIndent}\t\tmultipleValues: true,
${itemIndent}\t},
${itemIndent}\toptions: [
${itemIndent}\t\t{
${itemIndent}\t\t\tdisplayName: 'Field',
${itemIndent}\t\t\tname: 'entries',
${itemIndent}\t\t\tvalues: [
${fixedCollectionOptions}
${itemIndent}\t\t\t],
${itemIndent}\t\t},
${itemIndent}\t],
${itemIndent}\tdescription: '${description}',
${itemIndent}},`;
		}

		return `${itemIndent}{
${itemIndent}\tdisplayName: '${displayName}',
${itemIndent}\tname: '${fieldName}',
${itemIndent}\ttype: '${fieldType}',
${itemIndent}\tdefault: ${defaultValue},
${itemIndent}\tdescription: '${description}',
${itemIndent}},`;
	}

	private getRequiredCollectionDefaultValue(schema: any): string {
		const defaultObject = this.buildRequiredCollectionDefaultObject(schema);
		if (!defaultObject || Object.keys(defaultObject).length === 0) {
			return '{}';
		}

		return JSON.stringify(defaultObject);
	}

	private buildRequiredCollectionDefaultObject(
		schema: any,
		depth = 0,
	): Record<string, unknown> | null {
		if (depth > 5 || !schema?.properties || typeof schema.properties !== 'object') {
			return null;
		}

		const requiredFields = Array.isArray(schema.required) ? schema.required : [];
		if (requiredFields.length === 0) {
			return null;
		}

		const result: Record<string, unknown> = {};

		for (const fieldName of requiredFields) {
			const fieldSchema = schema.properties[fieldName];
			if (!fieldSchema) {
				continue;
			}

			const fieldType = this.mapSchemaTypeToN8NFieldType(fieldSchema);
			if (!fieldType) {
				continue;
			}

			if (fieldType === 'collection') {
				const nestedDefaultObject = this.buildRequiredCollectionDefaultObject(
					fieldSchema,
					depth + 1,
				);
				result[fieldName] =
					nestedDefaultObject && Object.keys(nestedDefaultObject).length > 0
						? nestedDefaultObject
						: {};
				continue;
			}

			if (fieldType === 'fixedCollection') {
				result[fieldName] = {};
				continue;
			}

			result[fieldName] = this.getSchemaDefaultRuntimeValue(fieldSchema, fieldType);
		}

		return result;
	}

	private getSchemaDefaultRuntimeValue(schema: any, fieldType: string): unknown {
		if (schema?.default !== undefined && schema?.default !== null) {
			return schema.default;
		}

		if (fieldType === 'boolean') {
			return false;
		}

		if (fieldType === 'number') {
			if (typeof schema?.minimum === 'number') {
				return schema.minimum;
			}
			if (typeof schema?.example === 'number') {
				return schema.example;
			}
			return 0;
		}

		if (fieldType === 'collection' || fieldType === 'fixedCollection' || fieldType === 'json') {
			return {};
		}

		if (fieldType === 'options' && Array.isArray(schema?.enum) && schema.enum.length > 0) {
			return String(schema.enum[0]);
		}

		return '';
	}

	private mapSchemaTypeToN8NFieldType(schema: any): string | null {
		if (Array.isArray(schema?.enum) && schema.enum.length > 0) {
			return 'options';
		}

		switch (schema?.type) {
			case 'string':
				return 'string';
			case 'number':
			case 'integer':
				return 'number';
			case 'boolean':
				return 'boolean';
			case 'object':
				if (schema?.properties) {
					return 'collection';
				}
				if (this.isSimpleAdditionalPropertiesSchema(schema?.additionalProperties)) {
					return 'fixedCollection';
				}
				return 'json';
			case 'array':
				return 'json';
			default:
				if (schema?.properties) {
					return 'collection';
				}
				if (this.isSimpleAdditionalPropertiesSchema(schema?.additionalProperties)) {
					return 'fixedCollection';
				}
				if (schema?.items || schema?.additionalProperties) {
					return 'json';
				}
				return null;
		}
	}

	private isSimpleAdditionalPropertiesSchema(additionalProperties: any): boolean {
		if (!additionalProperties || additionalProperties === true) {
			return false;
		}

		if (Array.isArray(additionalProperties?.enum) && additionalProperties.enum.length > 0) {
			return true;
		}

		return ['string', 'number', 'integer', 'boolean'].includes(additionalProperties?.type);
	}

	private generateFixedCollectionEntryValues(valueSchema: any, itemIndent: string): string {
		const keyField = `${itemIndent}{
${itemIndent}\tdisplayName: 'Key',
${itemIndent}\tname: 'key',
${itemIndent}\ttype: 'string',
${itemIndent}\tdefault: '',
${itemIndent}\trequired: false,
${itemIndent}\tdescription: 'Field key',
${itemIndent}},`;

		const normalizedValueSchema =
			valueSchema && valueSchema !== true && typeof valueSchema === 'object'
				? valueSchema
				: { type: 'string' };

		const valueFieldType = this.mapSchemaTypeToN8NFieldType(normalizedValueSchema) || 'string';
		const valueDescription = this.sanitizeDescription(
			this.formatDescription(normalizedValueSchema?.description || 'Field value', valueFieldType),
		);
		const valueDefault = this.getSchemaDefaultValue(normalizedValueSchema, valueFieldType);

		if (
			valueFieldType === 'options' &&
			Array.isArray(normalizedValueSchema?.enum) &&
			normalizedValueSchema.enum.length > 0
		) {
			const enumOptions = [...normalizedValueSchema.enum]
				.map((value: unknown) => String(value))
				.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
				.map(
					(value) =>
						`${itemIndent}\t{\n${itemIndent}\t\tname: '${this.nameConverter.toDisplayName(
							value,
						)}',\n${itemIndent}\t\tvalue: '${value}',\n${itemIndent}\t},`,
				)
				.join('\n');

			const valueField = `${itemIndent}{
${itemIndent}\tdisplayName: 'Value',
${itemIndent}\tname: 'value',
${itemIndent}\ttype: 'options',
${itemIndent}\tdefault: ${valueDefault},
${itemIndent}\toptions: [
${enumOptions}
${itemIndent}\t],
${itemIndent}\tdescription: '${valueDescription}',
${itemIndent}},`;

			return `${keyField}\n${valueField}`;
		}

		const normalizedValueFieldType =
			valueFieldType === 'collection' || valueFieldType === 'fixedCollection'
				? 'json'
				: valueFieldType;
		const normalizedDefault = this.getSchemaDefaultValue(
			normalizedValueSchema,
			normalizedValueFieldType,
		);
		const valueField = `${itemIndent}{
${itemIndent}\tdisplayName: 'Value',
${itemIndent}\tname: 'value',
${itemIndent}\ttype: '${normalizedValueFieldType}',
${itemIndent}\tdefault: ${normalizedDefault},
${itemIndent}\tdescription: '${valueDescription}',
${itemIndent}},`;

		return `${keyField}\n${valueField}`;
	}

	private getSchemaDefaultValue(schema: any, fieldType: string): string {
		if (schema?.default !== undefined && schema?.default !== null) {
			return JSON.stringify(schema.default);
		}

		if (fieldType === 'boolean') {
			return 'false';
		}

		if (fieldType === 'number') {
			if (typeof schema?.minimum === 'number') {
				return JSON.stringify(schema.minimum);
			}
			if (typeof schema?.example === 'number') {
				return JSON.stringify(schema.example);
			}
			return '0';
		}

		if (fieldType === 'collection') {
			return '{}';
		}

		if (fieldType === 'fixedCollection') {
			return '{}';
		}

		if (fieldType === 'json') {
			return `'{}'`;
		}

		if (fieldType === 'options' && Array.isArray(schema?.enum) && schema.enum.length > 0) {
			return JSON.stringify(String(schema.enum[0]));
		}

		return `''`;
	}

	/**
	 * Sort request body parameters alphabetically by field key to satisfy n8n lint rules
	 */
	private compareRequestBodyParameters(a: OperationParameter, b: OperationParameter): number {
		return a.name.localeCompare(b.name);
	}

	/**
	 * Sanitize description text for use in TypeScript strings
	 */
	private sanitizeDescription(description: string): string {
		if (!description) return '';

		return (
			description
				// Replace newlines and tabs with spaces
				.replace(/[\r\n\t]/g, ' ')
				// Replace multiple spaces with single space
				.replace(/\s+/g, ' ')
				// Escape backslashes first (must be done before other escapes)
				.replace(/\\/g, '\\\\')
				// Escape single quotes for TypeScript strings
				.replace(/'/g, "\\'")
				// Escape backticks
				.replace(/`/g, '\\`')
				// Remove curly braces entirely (they cause parsing issues)
				.replace(/[{}]/g, '')
				// Trim whitespace
				.trim()
				// Remove final period to comply with ESLint rules
				.replace(/\.$/, '')
				// Limit length to avoid overly long descriptions
				.substring(0, 240) + (description.length > 240 ? '...' : '')
		);
	}
}
