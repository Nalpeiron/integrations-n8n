// Shared product configuration for generators
export const DEFAULT_OPENAPI_URL =
	'https://oriondev.api.nalpeiron-dev.com:8443/openapi/v1/2024-05-01-alpha/openapi.json';

export interface ProductConfig {
	tag: string;
	outputDir: string;
	displayName: string;
	excludedResources?: string[];
}

export const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
	zentitle: {
		tag: 'Zentitle',
		outputDir: 'nodes/Nalpeiron/Zentitle2',
		displayName: 'Zentitle2',
		excludedResources: ['tenant', 'abl', 'account', 'localLicenseServer'],
	},
	zengain: {
		tag: 'Zengain',
		outputDir: 'nodes/Nalpeiron/Zengain',
		displayName: 'Zengain',
		excludedResources: ['account', 'insight', 'product', 'subscription'],
	},
};
