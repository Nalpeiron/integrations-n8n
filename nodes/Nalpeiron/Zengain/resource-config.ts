import type { INodePropertyOptions } from 'n8n-workflow';

export interface IResourceConfig {
	name: string;
	value: string;
}

/**
 * Central configuration for all resources in the Nalpeiron node
 * Generated automatically from OpenAPI specification
 */
export const RESOURCE_CONFIGS: IResourceConfig[] = [{ name: 'Customer', value: 'customer' }];

/**
 * Generate resource options for the node property dropdown
 */
export function getResourceOptions(): INodePropertyOptions[] {
	return [
		{
			name: 'Customer',
			value: 'customer',
			description: 'Manage customer general operations',
		},
	];
}

/**
 * Find resource configuration by value
 */
export function getResourceConfig(resourceValue: string): IResourceConfig | undefined {
	return RESOURCE_CONFIGS.find((config) => config.value === resourceValue);
}
