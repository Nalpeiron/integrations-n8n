// Shared product configuration for generators
export const DEFAULT_OPENAPI_URL = 'https://api.nalpeiron.io/openapi/v1/2025-10-10/openapi.json';

export interface ProductConfig {
	tag: string;
	outputDir: string;
	displayName: string;
	excludedResources?: string[];
	excludedOperations?: {
		[resourceName: string]: string[]; // Array of operationIds to exclude from specific resources
	};
	excludedWebhooks?: string[]; // Array of eventCodes to exclude from webhook generation
}

export const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
	zentitle: {
		tag: 'Zentitle',
		outputDir: 'nodes/Nalpeiron/Zentitle2',
		displayName: 'Zentitle2',
		excludedResources: ['tenant', 'abl', 'account', 'localLicenseServer'],
		excludedOperations: {
			entitlement: ['EntitlementGroup_GetLicenseFile'],
		},
	},
	zengain: {
		tag: 'Zengain',
		outputDir: 'nodes/Nalpeiron/Zengain',
		displayName: 'Zengain',
		excludedResources: ['account', 'insight', 'product', 'subscription'],
	},
};
