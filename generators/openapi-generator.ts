#!/usr/bin/env ts-node

import * as fs from 'fs/promises';
import * as path from 'path';
import { OpenAPIParser } from './utils/openapi-parser';
import { TemplateEngine } from './utils/template-engine';
import { OPENAPI_URL, OpenAPIDownloader } from './utils/openapi-downloader';
import { VersionTracker } from './utils/version-tracker';
import type { GeneratedResource, GenerationConfig } from './types/generator-types';

class OpenAPIGenerator {
	private parser: OpenAPIParser;
	private templateEngine: TemplateEngine;
	private downloader: OpenAPIDownloader;
	private versionTracker: VersionTracker;
	private config: GenerationConfig;

	constructor(
		private outputDir: string,
		private openApiUrl?: string,
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

		const apiUrl = this.openApiUrl || OPENAPI_URL;

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

			// Update version info
			await this.versionTracker.updateComponentVersion('NalpeironZentitle2', apiUrl, version, {
				generatedBy: 'openapi-generator',
				resourceCount: resources.length,
				config: {
					methods: this.config.allowedMethods,
					excludedPatterns: this.config.excludedResourcePatterns,
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

// Import only the generated property modules (filtered for GET only, excluding Zengain)

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
import { BaseResourceHandler } from './base-resource-handler';
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

	setExcludedResourcePatterns(patterns: string[]): this {
		this.config.excludedResourcePatterns = patterns;
		return this;
	}
}

// CLI interface
async function main() {
	const args = process.argv.slice(2);
	const getOnly = args.includes('--get-only');
	const excludeZengain = args.includes('--exclude-zengain');

	const outputDir = path.join(__dirname, '..', 'nodes', 'Nalpeiron', 'Zentitle2');

	const generator = new OpenAPIGenerator(outputDir);

	// Configure filtering based on CLI flags
	if (getOnly) {
		generator.setAllowedMethods(['GET']);
		console.log('🔍 Filtering to GET methods only');
	}

	if (excludeZengain) {
		generator.setExcludedResourcePatterns([
			'*subscription*',
			'*insight*',
			'*account*',
			'*zengain*',
		]);
		console.log('🚫 Excluding Zengain-related resources');
	}

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
