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
				op.method === 'POST' ||
				op.method === 'PUT' ||
				op.method === 'PATCH',
		);

		const imports = needsIDataObject
			? `import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';`
			: `import type { IExecuteFunctions } from 'n8n-workflow';`;

		return `${imports}
import { BaseResourceHandler } from '../base-resource-handler';
import { makeAuthenticatedRequest, type INalpeironCredentials } from '../../utils';`;
	}

	private generateOperationCases(resource: GeneratedResource): string {
		const operationMethods = this.createUniqueMethodNames(resource);

		return resource.operations
			.map((op) => {
				const methodName = operationMethods.get(op.name) || 'handleUnknown';
				return `\t\t\tcase '${op.name}':\n\t\t\t\treturn this.${methodName}(executeFunctions, credentials, accessToken, itemIndex);`;
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
		method += `\t\tcredentials: INalpeironCredentials,\n`;
		method += `\t\taccessToken: string,\n`;
		method += `\t\titemIndex: number,\n`;
		method += `\t): Promise<any> {\n`;

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

		// Handle request body for POST/PUT operations
		if (operation.method === 'POST' || operation.method === 'PUT' || operation.method === 'PATCH') {
			method += `\t\tconst body = this.getNodeParameter(\n`;
			method += `\t\t\texecuteFunctions,\n`;
			method += `\t\t\t'additionalFields',\n`;
			method += `\t\t\titemIndex,\n`;
			method += `\t\t\t{},\n`;
			method += `\t\t) as IDataObject;\n\n`;
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
		method += `\t\t\t'${operation.method}',\n`;
		method += `\t\t\t\`${apiPath}\`,\n`;
		method += `\t\t\taccessToken,\n`;
		method += `\t\t\tcredentials,\n`;
		method += `\t\t\texecuteFunctions.helpers,\n`;

		// Add body parameter for write operations
		if (operation.method === 'POST' || operation.method === 'PUT' || operation.method === 'PATCH') {
			method += `\t\t\tbody,\n`;
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
				displayName: this.nameConverter.toOperationDisplayName(
					operation.name,
					resource.displayName,
				),
				action: this.nameConverter.toOperationAction(operation.name, resource.displayName),
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
		const writeOperations = resource.operations.filter(
			(op) => op.method === 'POST' || op.method === 'PUT' || op.method === 'PATCH',
		);
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
\t\tdescription: '${this.sanitizeDescription(param.description)}',
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
		return `\t\t\t{
\t\t\t\tdisplayName: '${param.displayName}',
\t\t\t\tname: '${param.name}',
\t\t\t\ttype: '${param.type}',
\t\t\t\tdefault: '',
\t\t\t\tdescription: '${this.sanitizeDescription(param.description)}',
\t\t\t},`;
	}

	private generateWriteOperationFields(
		resource: GeneratedResource,
		writeOperations: ResourceOperation[],
	): string {
		const operationNames = writeOperations.map((op) => `'${op.name}'`).join(', ');

		return `\t// Additional fields for create/update operations
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
\t\t\t{
\t\t\t\tdisplayName: 'Data',
\t\t\t\tname: 'data',
\t\t\t\ttype: 'json',
\t\t\t\tdefault: '{}',
\t\t\t\tdescription: 'Request body data as JSON',
\t\t\t},
\t\t],
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
				// Escape double quotes
				.replace(/"/g, '\\"')
				// Escape backticks
				.replace(/`/g, '\\`')
				// Remove curly braces entirely (they cause parsing issues)
				.replace(/[{}]/g, '')
				// Trim whitespace
				.trim()
				// Remove final period to comply with ESLint rules
				.replace(/\.$/, '')
				// Limit length to avoid overly long descriptions
				.substring(0, 120) + (description.length > 120 ? '...' : '')
		);
	}
}
