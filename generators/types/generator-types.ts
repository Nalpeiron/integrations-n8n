// OpenAPI types
export interface OpenAPISpec {
	openapi: string;
	info: {
		title: string;
		description?: string;
		version: string;
	};
	servers?: Array<{
		url: string;
		description?: string;
	}>;
	paths: Record<string, OpenAPIPath>;
	components?: {
		schemas?: Record<string, any>;
		parameters?: Record<string, any>;
		responses?: Record<string, any>;
	};
}

export interface OpenAPIPath {
	get?: OpenAPIOperation;
	post?: OpenAPIOperation;
	put?: OpenAPIOperation;
	delete?: OpenAPIOperation;
	patch?: OpenAPIOperation;
	options?: OpenAPIOperation;
	head?: OpenAPIOperation;
	trace?: OpenAPIOperation;
}

export interface OpenAPIOperation {
	tags?: string[];
	summary?: string;
	description?: string;
	operationId?: string;
	parameters?: Array<OpenAPIParameter | { $ref: string }>;
	requestBody?: OpenAPIRequestBody | { $ref: string };
	responses: Record<string, OpenAPIResponse | { $ref: string }>;
	security?: Array<Record<string, string[]>>;
}

export interface OpenAPIParameter {
	name: string;
	in: 'query' | 'header' | 'path' | 'cookie';
	description?: string;
	required?: boolean;
	schema?: any;
	style?: string;
	explode?: boolean;
}

export interface OpenAPIRequestBody {
	description?: string;
	content: Record<
		string,
		{
			schema?: any | { $ref: string };
			example?: any;
			examples?: Record<string, any>;
		}
	>;
	required?: boolean;
}

export interface OpenAPIResponse {
	description: string;
	headers?: Record<string, any>;
	content?: Record<
		string,
		{
			schema?: any | { $ref: string };
			example?: any;
			examples?: Record<string, any>;
		}
	>;
}

// Generator types
export interface GeneratedResource {
	name: string; // camelCase resource name (e.g., 'customer')
	displayName: string; // Human readable name (e.g., 'Customer')
	description: string; // Resource description
	fileName: string; // kebab-case file name (e.g., 'customer')
	handlerClassName: string; // PascalCase class name (e.g., 'CustomerResourceHandler')
	propertiesExportName: string; // camelCase export name (e.g., 'customerProperties')
	operations: ResourceOperation[];
	schemas: string[]; // References to OpenAPI schemas used by this resource
}

export interface ResourceOperation {
	name: string; // Operation name (e.g., 'get', 'list', 'create')
	displayName: string; // Human readable name (e.g., 'Get Customer')
	description: string; // Operation description
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	path: string; // API path pattern (e.g., '/api/v1/customers/{id}')
	operationId?: string; // OpenAPI operationId
	parameters: OperationParameter[];
	requestBodySchema?: string | null; // Reference to request body schema
	responseSchema?: string | null; // Reference to response schema
	isListOperation: boolean; // True if this is a list/collection operation
	isNestedOperation: boolean; // True if this operates on nested resources
	tags: string[]; // OpenAPI tags
}

export interface OperationParameter {
	name: string; // Parameter name
	displayName: string; // Human readable name
	type: string; // n8n field type ('string', 'number', 'boolean', etc.)
	required: boolean; // Whether parameter is required
	description: string; // Parameter description
	location: 'path' | 'query' | 'header' | 'body'; // Where the parameter is sent
	schema?: any; // OpenAPI schema for the parameter
	enum?: string[]; // Enumeration values if applicable
	default?: any; // Default value
}

export interface GenerationConfig {
	generateHandlers: boolean; // Whether to generate handler files
	generateProperties: boolean; // Whether to generate property files
	updateRegistry: boolean; // Whether to update registry files
	allowedMethods?: string[]; // HTTP methods to include (e.g., ['GET'])
	excludedResources?: string[]; // Resources to exclude by exact name (e.g., ['tenant', 'subscription'])
	includeOnlyTags?: string[]; // Only include operations with these OpenAPI tags (e.g., ['Zentitle', 'Zengain'])
}

// Template context types
export interface HandlerTemplateContext {
	resource: GeneratedResource;
	imports: string;
	className: string;
	operations: string; // Switch case statements
	methods: string; // Method implementations
}

export interface PropertiesTemplateContext {
	resource: GeneratedResource;
	exportName: string;
	operationOptions: string; // Operation dropdown options
	parameterFields: string; // Parameter field definitions
}

// File generation results
export interface GenerationResult {
	success: boolean;
	message: string;
	resourcesGenerated: number;
	filesCreated: string[];
	errors: string[];
}

// CLI options
export interface CLIOptions {
	verbose?: boolean;
	output?: string;
	resources?: string[]; // Generate only specific resources
}
