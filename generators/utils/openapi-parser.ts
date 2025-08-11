import * as fs from 'fs/promises';
import { NameConverter } from './name-converter';
import type {
	OpenAPISpec,
	GeneratedResource,
	ResourceOperation,
	OperationParameter,
	OpenAPIOperation,
	GenerationConfig,
} from '../types/generator-types';

export class OpenAPIParser {
	private nameConverter: NameConverter;

	constructor() {
		this.nameConverter = new NameConverter();
	}

	async loadSpec(filePath: string): Promise<OpenAPISpec> {
		const content = await fs.readFile(filePath, 'utf-8');
		return JSON.parse(content) as OpenAPISpec;
	}

	async extractResources(
		spec: OpenAPISpec,
		config?: GenerationConfig,
	): Promise<GeneratedResource[]> {
		const resources: GeneratedResource[] = [];
		const resourceMap = new Map<string, GeneratedResource>();

		// Parse all paths and group by resource
		for (const [pathPattern, pathInfo] of Object.entries(spec.paths)) {
			if (!pathInfo) continue;

			for (const [method, operation] of Object.entries(pathInfo)) {
				if (!operation || !this.isValidMethod(method)) continue;

				// Filter by allowed HTTP methods if specified
				if (config?.allowedMethods && !config.allowedMethods.includes(method.toUpperCase())) {
					continue;
				}

				// Filter by tags if specified (include only operations with specified tags)
				if (config?.includeOnlyTags && config.includeOnlyTags.length > 0) {
					const operationTags = operation.tags || [];
					const hasRequiredTag = config.includeOnlyTags.some(tag => 
						operationTags.includes(tag)
					);
					if (!hasRequiredTag) {
						continue;
					}
				}

				const resourceInfo = this.extractResourceFromPath(pathPattern, method, operation);
				if (!resourceInfo) continue;

				// Filter by excluded resources if specified
				if (this.shouldExcludeResource(resourceInfo.resourceName, config)) {
					continue;
				}

				// Get or create resource
				if (!resourceMap.has(resourceInfo.resourceName)) {
					resourceMap.set(
						resourceInfo.resourceName,
						this.createResource(resourceInfo.resourceName, operation),
					);
				}

				const resource = resourceMap.get(resourceInfo.resourceName)!;

				// Add operation to resource (with deduplication)
				const resourceOperation = this.createOperation(
					pathPattern,
					method.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
					operation,
					resourceInfo,
				);

				// Check if we already have an operation with this name
				const existingOperation = resource.operations.find(
					(op) => op.name === resourceOperation.name,
				);
				if (!existingOperation) {
					resource.operations.push(resourceOperation);
				} else {
					// Create a unique name for this operation
					let counter = 2;
					let uniqueName = `${resourceOperation.name}${counter}`;
					while (resource.operations.find((op) => op.name === uniqueName)) {
						counter++;
						uniqueName = `${resourceOperation.name}${counter}`;
					}
					resourceOperation.name = uniqueName;
					resource.operations.push(resourceOperation);
				}
			}
		}

		// Convert map to array and filter valid resources
		for (const resource of resourceMap.values()) {
			if (this.isValidResource(resource)) {
				resources.push(resource);
			}
		}

		return resources.sort((a, b) => a.name.localeCompare(b.name));
	}

	private extractResourceFromPath(
		pathPattern: string,
		method: string,
		operation: OpenAPIOperation,
	): {
		resourceName: string;
		operationType: string;
		hasPathParams: boolean;
		isNestedResource: boolean;
	} | null {
		// Remove query parameters and normalize path
		const cleanPath = pathPattern.split('?')[0];

		// Skip non-API paths
		if (!cleanPath.startsWith('/api/v1/')) {
			return null;
		}

		// Extract path segments after /api/v1/
		const segments = cleanPath.replace('/api/v1/', '').split('/').filter(Boolean);

		if (segments.length === 0) {
			return null;
		}

		// Determine resource name and operation type
		let resourceName: string;
		let operationType: string;
		const hasPathParams = segments.some((segment) => segment.startsWith('{'));
		const isNestedResource = segments.length > 2;

		// Always use the first segment as the main resource name
		resourceName = this.nameConverter.toResourceName(segments[0]);

		// Generate meaningful operation names based on path structure
		operationType = this.generateMeaningfulOperationName(segments, method);

		// Clean up operation type to ensure it's valid
		operationType = this.sanitizeOperationType(operationType);

		return {
			resourceName,
			operationType,
			hasPathParams,
			isNestedResource,
		};
	}

	private generateMeaningfulOperationName(segments: string[], method: string): string {
		const methodLower = method.toLowerCase();

		// For single segment (e.g., /entitlements)
		if (segments.length === 1) {
			return methodLower === 'get' ? 'list' : methodLower;
		}

		// For two segments with ID (e.g., /entitlements/{id})
		if (segments.length === 2 && segments[1].startsWith('{')) {
			return methodLower === 'get' ? 'get' : methodLower;
		}

		// For complex paths, create meaningful names based on path segments
		const pathParts: string[] = [];

		// Skip the first segment (resource name) and collect meaningful parts
		for (let i = 1; i < segments.length; i++) {
			const segment = segments[i];

			// Skip parameter segments like {id}
			if (segment.startsWith('{')) {
				continue;
			}

			// Convert kebab-case to PascalCase for better concatenation
			const part = this.nameConverter.toPascalCase(segment.replace(/-/g, '_'));
			pathParts.push(part);
		}

		// If we have meaningful path parts, create operation name
		if (pathParts.length > 0) {
			const pathSuffix = pathParts.join('');

			switch (methodLower) {
				case 'get':
					// Determine if this is a list or get operation based on last segment
					const lastSegment = segments[segments.length - 1];
					const isCollection = !lastSegment.startsWith('{');
					return isCollection ? `list${pathSuffix}` : `get${pathSuffix}`;
				case 'post':
					return `create${pathSuffix}`;
				case 'put':
				case 'patch':
					return `update${pathSuffix}`;
				case 'delete':
					return `delete${pathSuffix}`;
				default:
					return `${methodLower}${pathSuffix}`;
			}
		}

		// Fallback to basic operation names
		return this.getStandardOperation(methodLower, segments.length > 1);
	}

	private getStandardOperation(method: string, hasId: boolean): string {
		switch (method.toLowerCase()) {
			case 'get':
				return hasId ? 'get' : 'list';
			case 'post':
				return 'create';
			case 'put':
			case 'patch':
				return 'update';
			case 'delete':
				return 'delete';
			default:
				return method.toLowerCase();
		}
	}

	private createResource(resourceName: string, operation: OpenAPIOperation): GeneratedResource {
		const displayName = this.nameConverter.toDisplayName(resourceName);
		const description = this.extractDescription(operation, displayName);

		return {
			name: resourceName,
			displayName,
			description,
			fileName: this.nameConverter.toFileName(resourceName),
			handlerClassName: this.nameConverter.toHandlerClassName(resourceName),
			propertiesExportName: this.nameConverter.toPropertiesExportName(resourceName),
			operations: [],
			schemas: [],
		};
	}

	private createOperation(
		pathPattern: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
		operation: OpenAPIOperation,
		resourceInfo: { operationType: string; hasPathParams: boolean; isNestedResource: boolean },
	): ResourceOperation {
		const parameters = this.extractParameters(operation, pathPattern);
		const operationName = this.generateOperationName(resourceInfo.operationType, operation);

		return {
			name: resourceInfo.operationType,
			displayName: operationName.displayName,
			description: operation.description || operationName.description,
			method,
			path: pathPattern,
			operationId: operation.operationId,
			parameters,
			requestBodySchema: this.extractRequestBodySchema(operation),
			responseSchema: this.extractResponseSchema(operation),
			isListOperation: resourceInfo.operationType === 'list',
			isNestedOperation: resourceInfo.isNestedResource,
			tags: operation.tags || [],
		};
	}

	private generateOperationName(
		operationType: string,
		operation: OpenAPIOperation,
	): {
		displayName: string;
		description: string;
	} {
		// Use operation summary if available
		if (operation.summary) {
			return {
				displayName: operation.summary,
				description: operation.description || operation.summary,
			};
		}

		// Generate based on operation type
		const displayNames: Record<string, string> = {
			get: 'Get',
			list: 'List',
			create: 'Create',
			update: 'Update',
			delete: 'Delete',
		};

		const displayName =
			displayNames[operationType] || this.nameConverter.toDisplayName(operationType);
		const description = `${displayName} operation`;

		return { displayName, description };
	}

	private extractParameters(
		operation: OpenAPIOperation,
		pathPattern: string,
	): OperationParameter[] {
		const parameters: OperationParameter[] = [];

		// Add path parameters
		const pathParams = this.extractPathParameters(pathPattern);
		parameters.push(...pathParams);

		// Add query parameters from OpenAPI spec
		if (operation.parameters) {
			for (const param of operation.parameters) {
				if ('$ref' in param) continue; // Skip refs for now

				if (param.in === 'query') {
					parameters.push({
						name: param.name,
						displayName: this.nameConverter.toDisplayName(param.name),
						type: this.mapOpenAPITypeToN8N(param.schema),
						required: param.required || false,
						description: param.description || '',
						location: 'query',
					});
				}
			}
		}

		return parameters;
	}

	private extractPathParameters(pathPattern: string): OperationParameter[] {
		const parameters: OperationParameter[] = [];
		const pathParamRegex = /\{([^}]+)\}/g;
		let match;

		while ((match = pathParamRegex.exec(pathPattern)) !== null) {
			const paramName = match[1];
			parameters.push({
				name: paramName,
				displayName: this.nameConverter.toDisplayName(paramName),
				type: 'string',
				required: true,
				description: `The ${paramName} identifier`,
				location: 'path',
			});
		}

		return parameters;
	}

	private mapOpenAPITypeToN8N(schema: any): string {
		if (!schema) return 'string';

		switch (schema.type) {
			case 'string':
				return 'string';
			case 'number':
			case 'integer':
				return 'number';
			case 'boolean':
				return 'boolean';
			case 'array':
				return 'multiOptions';
			case 'object':
				return 'collection';
			default:
				return 'string';
		}
	}

	private extractRequestBodySchema(operation: OpenAPIOperation): string | null {
		if (!operation.requestBody || '$ref' in operation.requestBody) {
			return null;
		}

		const content = operation.requestBody.content;
		if (content && content['application/json']?.schema) {
			const schema = content['application/json'].schema;
			if ('$ref' in schema) {
				return schema.$ref;
			}
		}

		return null;
	}

	private extractResponseSchema(operation: OpenAPIOperation): string | null {
		if (!operation.responses) return null;

		// Look for successful response (200, 201, etc.)
		for (const [statusCode, response] of Object.entries(operation.responses)) {
			if (statusCode.startsWith('2') && response && '$ref' in response === false) {
				const content = response.content;
				if (content && content['application/json']?.schema) {
					const schema = content['application/json'].schema;
					if ('$ref' in schema) {
						return schema.$ref;
					}
				}
			}
		}

		return null;
	}

	private extractDescription(operation: OpenAPIOperation, defaultDescription: string): string {
		const tags = operation.tags || [];
		const primaryTag = tags[0];

		if (primaryTag) {
			return `Manage ${primaryTag.toLowerCase()}`;
		}

		return `Manage ${defaultDescription.toLowerCase()}`;
	}

	private isValidMethod(method: string): boolean {
		return ['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase());
	}

	private sanitizeOperationType(operationType: string): string {
		// Remove any characters that would be invalid in TypeScript method names
		return (
			operationType
				// Remove curly braces and their contents
				.replace(/\{[^}]*\}/g, '')
				// Remove any special characters except letters, numbers, and underscores
				.replace(/[^a-zA-Z0-9_]/g, '')
				// Ensure it starts with a letter
				.replace(/^[^a-zA-Z]+/, '')
				// Convert to camelCase
				.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()) ||
			// Ensure it's not empty
			'operation'
		);
	}

	private shouldExcludeResource(resourceName: string, config?: GenerationConfig): boolean {
		if (!config) return false;

		// Check exact resource name matches
		if (config.excludedResources?.includes(resourceName.toLowerCase())) {
			return true;
		}

		return false;
	}

	private isValidResource(resource: GeneratedResource): boolean {
		// Must have at least one operation
		if (resource.operations.length === 0) {
			return false;
		}

		// Skip resources that are too specific or internal
		const skipList = ['root', 'api', 'v1', 'health', 'status', 'ping'];

		if (skipList.includes(resource.name.toLowerCase())) {
			return false;
		}

		return true;
	}
}
