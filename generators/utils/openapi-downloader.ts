import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

export const OPENAPI_URL = 'https://api.nalpeiron.io/openapi/v1/2024-01-01/openapi.json';

export interface OpenAPISpec {
	spec: any;
	version: string;
	tempFilePath: string;
}

export class OpenAPIDownloader {
	async downloadSpec(url: string = OPENAPI_URL): Promise<OpenAPISpec> {
		console.log(`📥 Downloading OpenAPI spec from: ${url}`);

		// Download the spec
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to download OpenAPI spec: ${response.status} ${response.statusText}`);
		}

		const spec = await response.json();
		const version = (spec as any).info?.version || 'unknown';

		// Create temporary file
		const tempDir = os.tmpdir();
		const tempFilePath = path.join(
			tempDir,
			`openapi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.json`,
		);

		await fs.writeFile(tempFilePath, JSON.stringify(spec, null, 2));

		console.log(`✅ Downloaded OpenAPI spec version: ${version}`);
		console.log(`📁 Temporary file: ${tempFilePath}`);

		return { spec, version, tempFilePath };
	}

	async cleanup(tempFilePath: string): Promise<void> {
		try {
			await fs.unlink(tempFilePath);
			console.log(`🧹 Cleaned up temporary file: ${tempFilePath}`);
		} catch (error) {
			console.warn(`⚠️  Failed to cleanup temporary file: ${error}`);
		}
	}
}
