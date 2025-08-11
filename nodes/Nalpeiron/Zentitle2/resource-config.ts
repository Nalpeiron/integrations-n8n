import type { INodePropertyOptions } from 'n8n-workflow';

export interface IResourceConfig {
	name: string;
	value: string;
}

/**
 * Central configuration for all resources in the Nalpeiron node
 * Generated automatically from OpenAPI specification
 */
export const RESOURCE_CONFIGS: IResourceConfig[] = [
	{ name: 'Attribute', value: 'attribute' },
	{ name: 'Customer', value: 'customer' },
	{ name: 'Entitlement', value: 'entitlement' },
	{ name: 'Feature', value: 'feature' },
	{ name: 'Offering', value: 'offering' },
	{ name: 'Plan', value: 'plan' },
	{ name: 'Product', value: 'product' },
];

/**
 * Generate resource options for the node property dropdown
 */
export function getResourceOptions(): INodePropertyOptions[] {
	return [
		{
			name: 'Attribute',
			value: 'attribute',
			description: 'Manage global attributes',
		},
		{
			name: 'Customer',
			value: 'customer',
			description: 'Manage customer general operations',
		},
		{
			name: 'Entitlement',
			value: 'entitlement',
			description: 'Manage entitlement general operations',
		},
		{
			name: 'Feature',
			value: 'feature',
			description: 'Manage global features',
		},
		{
			name: 'Offering',
			value: 'offering',
			description: 'Manage offerings',
		},
		{
			name: 'Plan',
			value: 'plan',
			description: 'Manage plans',
		},
		{
			name: 'Product',
			value: 'product',
			description: 'Manage product general operations',
		},
	];
}

/**
 * Find resource configuration by value
 */
export function getResourceConfig(resourceValue: string): IResourceConfig | undefined {
	return RESOURCE_CONFIGS.find((config) => config.value === resourceValue);
}
