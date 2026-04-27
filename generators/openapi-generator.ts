#!/usr/bin/env ts-node

import * as fs from 'fs/promises';
import * as path from 'path';
import { OpenAPIParser } from './utils/openapi-parser';
import { TemplateEngine } from './utils/template-engine';
import { OpenAPIDownloader } from './utils/openapi-downloader';
import { VersionTracker, type ComponentInfo } from './utils/version-tracker';
import type { GeneratedResource, GenerationConfig } from './types/generator-types';
import { DEFAULT_OPENAPI_URL, PRODUCT_CONFIGS } from './config/product-config';

class OpenAPIGenerator {
	private parser: OpenAPIParser;
	private templateEngine: TemplateEngine;
	private downloader: OpenAPIDownloader;
	private versionTracker: VersionTracker;
	private config: GenerationConfig;

	constructor(
		private outputDir: string,
		private openApiUrl?: string,
		private n8nInstanceVersion?: string,
	) {
		this.parser = new OpenAPIParser();
		this.templateEngine = new TemplateEngine();
		this.downloader = new OpenAPIDownloader();
		this.versionTracker = new VersionTracker();
		this.config = {
			generateHandlers: true,
			generateProperties: true,
			updateRegistry: true,
		};
	}

	async generate(): Promise<void> {
		console.log('🚀 Starting OpenAPI code generation...');

		// Download OpenAPI specification
		const {
			spec: openApiSpec,
			version,
			tempFilePath,
		} = await this.downloader.downloadSpec(this.openApiUrl);

		console.log(`📋 Using OpenAPI spec version: ${version}`);

		const apiUrl = this.openApiUrl || DEFAULT_OPENAPI_URL;

		try {
			// Clean generated directories
			await this.cleanGeneratedDirectories();

			// Parse OpenAPI specification
			const resources = await this.parser.extractResources(openApiSpec, this.config);

			console.log(`📊 Found ${resources.length} resources to generate`);

			console.log(`✨ Generating ${resources.length} resources`);

			// Generate code for each resource
			for (const resource of resources) {
				await this.generateResource(resource);
			}

			// Update registry files
			if (this.config.updateRegistry) {
				await this.updateRegistryFiles(resources);
			}

			// Update version info - determine component name based on output directory
			const componentName = this.outputDir.includes('Zengain')
				? 'NalpeironZengain'
				: 'NalpeironZentitle2';
			const n8nVersionInfo = await this.getN8nVersionInfo();

			await this.versionTracker.updateComponentVersion(componentName, apiUrl, version, {
				generatedBy: 'openapi-generator',
				resourceCount: resources.length,
				n8n: n8nVersionInfo,
				config: {
					methods: this.config.allowedMethods,
					excludedResources: this.config.excludedResources,
					excludedOperations: this.config.excludedOperations,
					includedTags: this.config.includeOnlyTags,
				},
			});

			console.log('✅ Code generation completed successfully!');
		} finally {
			// Always cleanup temporary file
			await this.downloader.cleanup(tempFilePath);
		}
	}

	private async generateResource(resource: GeneratedResource): Promise<void> {
		console.log(`📝 Generating resource: ${resource.name}`);

		// Generate handler
		if (this.config.generateHandlers) {
			await this.generateHandler(resource);
		}

		// Generate properties
		if (this.config.generateProperties) {
			await this.generateProperties(resource);
		}
	}

	private async generateHandler(resource: GeneratedResource): Promise<void> {
		const handlerCode = await this.templateEngine.renderHandler(resource);
		const handlerPath = path.join(
			this.outputDir,
			'resources',
			'handlers',
			`${resource.fileName}-handler.ts`,
		);

		await this.ensureDirectoryExists(path.dirname(handlerPath));
		await fs.writeFile(handlerPath, handlerCode);

		console.log(`  ✓ Handler: ${handlerPath}`);
	}

	private async generateProperties(resource: GeneratedResource): Promise<void> {
		const propertiesCode = await this.templateEngine.renderProperties(resource);
		const propertiesPath = path.join(
			this.outputDir,
			'properties',
			`${resource.fileName}-properties.ts`,
		);

		await this.ensureDirectoryExists(path.dirname(propertiesPath));
		await fs.writeFile(propertiesPath, propertiesCode);

		console.log(`  ✓ Properties: ${propertiesPath}`);
	}

	private async cleanGeneratedDirectories(): Promise<void> {
		console.log('🧹 Cleaning generated directories...');

		const handlersDir = path.join(this.outputDir, 'resources', 'handlers');
		const propertiesDir = path.join(this.outputDir, 'properties');

		try {
			// Remove all handler files
			const handlerFiles = await fs.readdir(handlersDir).catch(() => []);
			for (const file of handlerFiles) {
				if (file.endsWith('-handler.ts')) {
					await fs.unlink(path.join(handlersDir, file));
					console.log(`  🗑️  Removed handler: ${file}`);
				}
			}

			// Remove all generated property files
			const propertyFiles = await fs.readdir(propertiesDir).catch(() => []);
			for (const file of propertyFiles) {
				if (file.endsWith('-properties.ts')) {
					await fs.unlink(path.join(propertiesDir, file));
					console.log(`  🗑️  Removed properties: ${file}`);
				}
			}
		} catch (error) {
			console.log(`  ⚠️  Warning: Error cleaning directories: ${error}`);
		}
	}

	private async updateRegistryFiles(resources: GeneratedResource[]): Promise<void> {
		console.log('🔄 Updating registry files...');

		// Update property registry
		await this.updatePropertyRegistry(resources);

		// Update resource index
		await this.updateResourceIndex(resources);

		// Update resource config
		await this.updateResourceConfig(resources);
	}

	private async updatePropertyRegistry(resources: GeneratedResource[]): Promise<void> {
		const registryPath = path.join(this.outputDir, 'property-registry.ts');

		// Generate imports
		const imports = resources
			.map(
				(resource) =>
					`import { ${resource.propertiesExportName} } from './properties/${resource.fileName}-properties';`,
			)
			.join('\n');

		// Generate resource properties map entries
		const mapEntries = resources
			.map((resource) => `\t\t${resource.name}: ${resource.propertiesExportName},`)
			.join('\n');

		const newContent = `import type { INodeProperties } from 'n8n-workflow';
import { getResourceOptions } from './resource-config';
${imports}

// Import only the generated property modules

export interface IPropertyRegistry {
	getResourceSelectionProperty(): INodeProperties;
	getResourceProperties(): INodeProperties[];
	getAllProperties(): INodeProperties[];
}

/**
 * Registry for managing all node properties in a centralized way
 */
class PropertyRegistry implements IPropertyRegistry {
	private readonly resourcePropertiesMap: Record<string, INodeProperties[]> = {
		// Generated properties for each resource
${mapEntries}
	};
	/**
	 * Get the main resource selection property
	 */
	getResourceSelectionProperty(): INodeProperties {
		return {
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: getResourceOptions(),
			default: '',
		};
	}

	/**
	 * Get all resource-specific properties (operations, fields, etc.)
	 */
	getResourceProperties(): INodeProperties[] {
		const allProperties: INodeProperties[] = [];

		Object.values(this.resourcePropertiesMap).forEach((properties) => {
			allProperties.push(...properties);
		});

		return allProperties;
	}

	/**
	 * Get all properties for the node
	 */
	getAllProperties(): INodeProperties[] {
		return [this.getResourceSelectionProperty(), ...this.getResourceProperties()];
	}

	/**
	 * Get properties for a specific resource
	 */
	getPropertiesForResource(resourceValue: string): INodeProperties[] {
		return this.resourcePropertiesMap[resourceValue] || [];
	}

	/**
	 * Add or update properties for a resource (for future extensibility)
	 */
	registerResourceProperties(resourceValue: string, properties: INodeProperties[]): void {
		this.resourcePropertiesMap[resourceValue] = properties;
	}
}

// Export singleton instance
export const propertyRegistry = new PropertyRegistry();

/**
 * Convenience function to get all node properties
 */
export function getAllNodeProperties(): INodeProperties[] {
	return propertyRegistry.getAllProperties();
}

/**
 * Convenience function to get properties for a specific resource
 */
export function getResourceProperties(resourceValue: string): INodeProperties[] {
	return propertyRegistry.getPropertiesForResource(resourceValue);
}

/**
 * Convenience function to get the resource selection property
 */
export function getResourceSelectionProperty(): INodeProperties {
	return propertyRegistry.getResourceSelectionProperty();
}
`;

		await fs.writeFile(registryPath, newContent);
		console.log('  ✓ Regenerated property-registry.ts');
	}

	private async updateResourceIndex(resources: GeneratedResource[]): Promise<void> {
		const indexPath = path.join(this.outputDir, 'resources', 'index.ts');

		// Generate imports
		const imports = resources
			.map(
				(resource) =>
					`import { ${resource.handlerClassName} } from './handlers/${resource.fileName}-handler';`,
			)
			.join('\n');

		// Generate resource handler map entries
		const mapEntries = resources
			.map((resource) => `\t${resource.name}: new ${resource.handlerClassName}(),`)
			.join('\n');

		const newContent = `// Resource handler exports
import { BaseResourceHandler } from '../../shared/base-resource-handler';
${imports}

// Resource handler registry
export const resourceHandlers: Record<string, BaseResourceHandler> = {
${mapEntries}
	// Generated handlers will be added here by the generator
};

export { BaseResourceHandler };
`;

		await fs.writeFile(indexPath, newContent);
		console.log('  ✓ Regenerated resources/index.ts');
	}

	private async updateResourceConfig(resources: GeneratedResource[]): Promise<void> {
		const configPath = path.join(this.outputDir, 'resource-config.ts');

		// Generate resource options
		const resourceOptions = resources
			.map(
				(resource) =>
					`\t\t{\n\t\t\tname: '${resource.displayName}',\n\t\t\tvalue: '${resource.name}',\n\t\t\tdescription: '${resource.description}',\n\t\t},`,
			)
			.join('\n');

		const resourceConfigs = resources
			.map((resource) => `\t{ name: '${resource.displayName}', value: '${resource.name}' },`)
			.join('\n');

		const newContent = `import type { INodePropertyOptions } from 'n8n-workflow';

export interface IResourceConfig {
	name: string;
	value: string;
}

/**
 * Central configuration for all resources in the Nalpeiron node
 * Generated automatically from OpenAPI specification
 */
export const RESOURCE_CONFIGS: IResourceConfig[] = [
${resourceConfigs}
];

/**
 * Generate resource options for the node property dropdown
 */
export function getResourceOptions(): INodePropertyOptions[] {
	return [
${resourceOptions}
	];
}

/**
 * Find resource configuration by value
 */
export function getResourceConfig(resourceValue: string): IResourceConfig | undefined {
	return RESOURCE_CONFIGS.find((config) => config.value === resourceValue);
}
`;

		await fs.writeFile(configPath, newContent);
		console.log('  ✓ Regenerated resource-config.ts');
	}

	private async getN8nVersionInfo(): Promise<ComponentInfo['n8n'] | undefined> {
		let nodesApiVersion: number | undefined;
		let workflowVersion: string | undefined;

		try {
			const packageJsonPath = path.join(__dirname, '..', 'package.json');
			const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
			const packageJson = JSON.parse(packageJsonContent) as {
				n8n?: { n8nNodesApiVersion?: number };
			};

			if (typeof packageJson.n8n?.n8nNodesApiVersion === 'number') {
				nodesApiVersion = packageJson.n8n.n8nNodesApiVersion;
			}
		} catch {
			// Ignore and continue without n8nNodesApiVersion metadata
		}

		try {
			const workflowPackagePath = path.join(
				__dirname,
				'..',
				'node_modules',
				'n8n-workflow',
				'package.json',
			);
			const workflowPackageContent = await fs.readFile(workflowPackagePath, 'utf-8');
			const workflowPackage = JSON.parse(workflowPackageContent) as { version?: string };
			workflowVersion = workflowPackage.version;
		} catch {
			// Ignore and continue without n8n-workflow metadata
		}

		const instanceVersion = this.n8nInstanceVersion?.trim() || undefined;
		if (!nodesApiVersion && !workflowVersion && !instanceVersion) {
			return undefined;
		}

		return {
			nodesApiVersion,
			workflowVersion,
			instanceVersion,
		};
	}

	private async ensureDirectoryExists(dirPath: string): Promise<void> {
		try {
			await fs.access(dirPath);
		} catch {
			await fs.mkdir(dirPath, { recursive: true });
		}
	}

	// Public configuration methods

	setGenerateHandlers(generate: boolean): this {
		this.config.generateHandlers = generate;
		return this;
	}

	setGenerateProperties(generate: boolean): this {
		this.config.generateProperties = generate;
		return this;
	}

	setUpdateRegistry(update: boolean): this {
		this.config.updateRegistry = update;
		return this;
	}

	setAllowedMethods(methods: string[]): this {
		this.config.allowedMethods = methods.map((m) => m.toUpperCase());
		return this;
	}

	setExcludedResources(resources: string[]): this {
		this.config.excludedResources = resources.map((r) => r.toLowerCase());
		return this;
	}

	setExcludedOperations(operations: { [resourceName: string]: string[] }): this {
		// Convert resource names to lowercase for consistent matching
		this.config.excludedOperations = Object.keys(operations).reduce(
			(acc, resourceName) => {
				acc[resourceName.toLowerCase()] = operations[resourceName];
				return acc;
			},
			{} as { [resourceName: string]: string[] },
		);
		return this;
	}

	setIncludeOnlyTags(tags: string[]): this {
		this.config.includeOnlyTags = tags;
		return this;
	}
}

// CLI interface
async function main() {
	const args = process.argv.slice(2);

	// Parse CLI arguments
	const productIndex = args.indexOf('--product');
	const productName =
		productIndex !== -1 && args[productIndex + 1]
			? args[productIndex + 1].toLowerCase()
			: undefined;

	const openApiPathIndex = args.indexOf('--openapi-path');
	const openApiPath =
		openApiPathIndex !== -1 && args[openApiPathIndex + 1]
			? args[openApiPathIndex + 1]
			: DEFAULT_OPENAPI_URL;

	const tagsIndex = args.indexOf('--include-tags');
	const includeTags =
		tagsIndex !== -1 && args[tagsIndex + 1] ? args[tagsIndex + 1].split(',') : undefined;

	const outputIndex = args.indexOf('--output');
	const customOutput =
		outputIndex !== -1 && args[outputIndex + 1] ? args[outputIndex + 1] : undefined;

	const excludeResourcesIndex = args.indexOf('--exclude-resources');
	let excludeResources =
		excludeResourcesIndex !== -1 && args[excludeResourcesIndex + 1]
			? args[excludeResourcesIndex + 1].split(',')
			: undefined;

	const methodsIndex = args.indexOf('--methods');
	const methodsArg =
		methodsIndex !== -1 && args[methodsIndex + 1] ? args[methodsIndex + 1] : undefined;
	const methodsFromCli = methodsArg
		? Array.from(
				new Set(
					methodsArg
						.split(',')
						.map((method) => method.trim().toUpperCase())
						.filter(Boolean),
				),
			)
		: undefined;

	const n8nVersionIndex = args.indexOf('--n8n-version');
	const n8nInstanceVersion =
		n8nVersionIndex !== -1 && args[n8nVersionIndex + 1] ? args[n8nVersionIndex + 1] : undefined;

	const getOnly = args.includes('--get-only');
	const disableDefaults = args.includes('--no-defaults');

	// Apply product-based defaults
	let finalTags = includeTags;
	let outputDir: string;
	let excludedOperations: { [resourceName: string]: string[] } | undefined;
	let allowedMethods: string[] | undefined;

	if (productName && PRODUCT_CONFIGS[productName]) {
		const productConfig = PRODUCT_CONFIGS[productName];

		// Set tag if not explicitly provided
		if (!includeTags) {
			finalTags = [productConfig.tag];
		}

		// Set output directory if not explicitly provided
		outputDir = customOutput || path.join(__dirname, '..', productConfig.outputDir);

		// Set excluded resources if not explicitly provided and config has them
		if (!excludeResources && productConfig.excludedResources) {
			excludeResources = productConfig.excludedResources;
		}

		// Pass excluded operations from product config
		excludedOperations = productConfig.excludedOperations;
		if (!disableDefaults && productConfig.allowedMethods?.length) {
			allowedMethods = productConfig.allowedMethods.map((method) => method.toUpperCase());
		}

		console.log(`🎯 Using product configuration: ${productConfig.displayName}`);
	} else {
		outputDir = customOutput || path.join(__dirname, '..', 'nodes', 'Nalpeiron', 'Zentitle2');
	}

	const generator = new OpenAPIGenerator(outputDir, openApiPath, n8nInstanceVersion);

	// Configure filtering based on defaults and CLI flags
	if (getOnly) {
		allowedMethods = ['GET'];
	}

	if (methodsFromCli && methodsFromCli.length > 0) {
		const supportedMethods = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
		const invalidMethods = methodsFromCli.filter((method) => !supportedMethods.has(method));
		if (invalidMethods.length > 0) {
			throw new Error(
				`Unsupported methods in --methods: ${invalidMethods.join(', ')}. Supported methods: GET, POST, PUT, PATCH, DELETE`,
			);
		}

		allowedMethods = methodsFromCli;
	}

	if (allowedMethods && allowedMethods.length > 0) {
		generator.setAllowedMethods(allowedMethods);
		console.log(`🔧 Allowed methods: ${allowedMethods.join(', ')}`);
	}

	if (finalTags && finalTags.length > 0) {
		generator.setIncludeOnlyTags(finalTags);
		console.log(`🏷️  Including only tags: ${finalTags.join(', ')}`);
	}

	if (excludeResources && excludeResources.length > 0) {
		generator.setExcludedResources(excludeResources);
		console.log(`🚫 Excluding resources: ${excludeResources.join(', ')}`);
	}

	if (excludedOperations && Object.keys(excludedOperations).length > 0) {
		generator.setExcludedOperations(excludedOperations);
		const operationCount = Object.values(excludedOperations).reduce(
			(total: number, ops: string[]) => total + ops.length,
			0,
		);
		console.log(
			`🚫 Excluding ${operationCount} operations from ${Object.keys(excludedOperations).join(', ')} resources`,
		);
	}

	console.log(`🌐 Using OpenAPI URL: ${openApiPath}`);

	try {
		await generator.generate();
	} catch (error) {
		console.error('❌ Generation failed:', error);
		process.exit(1);
	}
}

// Run if called directly
if (require.main === module) {
	main();
}
