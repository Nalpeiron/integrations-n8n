import * as fs from 'fs/promises';
import * as path from 'path';

export interface ApiVersionInfo {
	lastUpdated: string;
	apiSource: {
		url: string;
		version: string;
	};
	components: {
		NalpeironZentitle2?: ComponentInfo;
		NalpeironZentitle2Trigger?: ComponentInfo;
		NalpeironZengain?: ComponentInfo;
		NalpeironZengainTrigger?: ComponentInfo;
	};
}

export interface ComponentInfo {
	generatedAt: string;
	generatedBy: string;
	resourceCount?: number;
	webhookEventCount?: number;
	config?: {
		methods?: string[];
		excludedResources?: string[];
		includedTags?: string[];
	};
}

export class VersionTracker {
	private versionFilePath: string;

	constructor() {
		this.versionFilePath = path.join(__dirname, '..', 'api-version.json');
	}

	async updateComponentVersion(
		componentName: 'NalpeironZentitle2' | 'NalpeironZentitle2Trigger' | 'NalpeironZengain' | 'NalpeironZengainTrigger',
		apiUrl: string,
		apiVersion: string,
		componentInfo: Omit<ComponentInfo, 'generatedAt'>
	): Promise<void> {
		console.log(`📋 Updating version info for ${componentName}...`);

		// Load existing version info or create new
		let versionInfo: ApiVersionInfo;
		try {
			const content = await fs.readFile(this.versionFilePath, 'utf-8');
			versionInfo = JSON.parse(content);
		} catch {
			versionInfo = {
				lastUpdated: new Date().toISOString(),
				apiSource: { url: apiUrl, version: apiVersion },
				components: {}
			};
		}

		// Update API source info
		versionInfo.apiSource = { url: apiUrl, version: apiVersion };
		versionInfo.lastUpdated = new Date().toISOString();

		// Update component info
		versionInfo.components[componentName] = {
			...componentInfo,
			generatedAt: new Date().toISOString()
		};

		// Write updated version info
		await fs.writeFile(this.versionFilePath, JSON.stringify(versionInfo, null, 2));
		
		console.log(`✅ Updated version info: ${componentName} generated from API ${apiVersion}`);
	}

	async getVersionInfo(): Promise<ApiVersionInfo | null> {
		try {
			const content = await fs.readFile(this.versionFilePath, 'utf-8');
			return JSON.parse(content);
		} catch {
			return null;
		}
	}
}