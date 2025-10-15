import * as fs from 'fs/promises';
import * as path from 'path';
import { OpenAPIDownloader } from './utils/openapi-downloader';
import { VersionTracker } from './utils/version-tracker';
import { DEFAULT_OPENAPI_URL, PRODUCT_CONFIGS } from './config/product-config';

interface WebhookEvent {
	eventCode: string;
	name: string;
	description: string;
	payloadSchema?: string;
}

interface WebhookEventOptions {
	name: string;
	value: string;
	description: string;
}

export class WebhookEventGenerator {
	private downloader: OpenAPIDownloader;
	private versionTracker: VersionTracker;

	constructor(
		private outputDir?: string,
		private openApiUrl?: string,
	) {
		this.downloader = new OpenAPIDownloader();
		this.versionTracker = new VersionTracker();
	}

	async generateWebhookEvents(
		openApiUrl?: string,
		includeOnlyTags?: string[],
		excludedWebhooks?: string[],
	): Promise<void> {
		console.log('🎯 Generating webhook events from OpenAPI spec...');

		const finalUrl = openApiUrl || this.openApiUrl || DEFAULT_OPENAPI_URL;

		// Download OpenAPI specification
		const {
			spec: openApiSpec,
			version,
			tempFilePath,
		} = await this.downloader.downloadSpec(finalUrl);

		console.log(`📋 Using OpenAPI spec version: ${version}`);

		try {
			const webhookEvents = this.extractWebhookEvents(
				openApiSpec,
				includeOnlyTags,
				excludedWebhooks,
			);
			console.log(`📊 Found ${webhookEvents.length} webhook events`);

			if (includeOnlyTags && includeOnlyTags.length > 0) {
				console.log(`🏷️  Filtered by tags: ${includeOnlyTags.join(', ')}`);
			}

			await this.generateWebhookEventsFile(webhookEvents);
			await this.generateWebhookTypesFile(webhookEvents);

			// Update version info - determine component name based on output directory
			const componentName = this.outputDir?.includes('Zengain')
				? 'NalpeironZengainTrigger'
				: 'NalpeironZentitle2Trigger';

			await this.versionTracker.updateComponentVersion(componentName, finalUrl, version, {
				generatedBy: 'webhook-generator',
				webhookEventCount: webhookEvents.length,
				config: {
					includedTags: includeOnlyTags,
					excludedWebhooks: excludedWebhooks,
				},
			});

			console.log('✅ Webhook events generation completed!');
		} finally {
			// Always cleanup temporary file
			await this.downloader.cleanup(tempFilePath);
		}
	}

	private extractWebhookEvents(
		openApiSpec: any,
		includeOnlyTags?: string[],
		excludedWebhooks?: string[],
	): WebhookEvent[] {
		const webhookEvents: WebhookEvent[] = [];

		// Extract from x-webhooks section
		if (openApiSpec['x-webhooks']) {
			for (const [eventCode, webhookDef] of Object.entries(openApiSpec['x-webhooks'])) {
				const webhookPost = (webhookDef as any).post;
				if (webhookPost) {
					// Filter by tags if specified
					if (includeOnlyTags && includeOnlyTags.length > 0) {
						const webhookTags = webhookPost.tags || [];
						const hasRequiredTag = includeOnlyTags.some((tag: string) => webhookTags.includes(tag));
						if (!hasRequiredTag) {
							continue;
						}
					}

					// Skip if webhook is excluded
					if (excludedWebhooks && excludedWebhooks.includes(eventCode)) {
						continue;
					}

					const event: WebhookEvent = {
						eventCode,
						name: this.formatEventName(eventCode),
						description:
							webhookPost.description ||
							webhookPost.summary ||
							`Triggered when ${eventCode} event occurs`,
						payloadSchema: this.extractPayloadSchema(webhookPost),
					};
					webhookEvents.push(event);
				}
			}
		}

		// Also extract webhook-related endpoints from regular paths if no x-webhooks section exists
		if (
			openApiSpec.paths &&
			(!openApiSpec['x-webhooks'] || Object.keys(openApiSpec['x-webhooks']).length === 0)
		) {
			for (const [pathPattern, pathInfo] of Object.entries(openApiSpec.paths)) {
				if (!pathInfo || typeof pathInfo !== 'object') continue;

				for (const [method, operation] of Object.entries(pathInfo)) {
					if (!operation || typeof operation !== 'object' || !operation.tags) continue;

					// Look for webhook-related tags
					const operationTags = operation.tags || [];
					const isWebhookEndpoint = operationTags.some(
						(tag: string) =>
							tag.toLowerCase().includes('webhook') || tag.toLowerCase().includes('trigger'),
					);

					if (isWebhookEndpoint) {
						// Filter by tags if specified
						if (includeOnlyTags && includeOnlyTags.length > 0) {
							const hasRequiredTag = includeOnlyTags.some((tag: string) =>
								operationTags.includes(tag),
							);
							if (!hasRequiredTag) {
								continue;
							}
						}

						// Generate event from webhook endpoint operation
						const eventCode =
							operation.operationId || `${method}.${pathPattern.replace(/[^a-zA-Z0-9]/g, '.')}`;

						// Skip if webhook is excluded
						if (excludedWebhooks && excludedWebhooks.includes(eventCode)) {
							continue;
						}

						const event: WebhookEvent = {
							eventCode,
							name: operation.summary || this.formatEventName(eventCode),
							description:
								operation.description || operation.summary || `Webhook event for ${eventCode}`,
							payloadSchema: this.extractPayloadSchema(operation),
						};
						webhookEvents.push(event);
					}
				}
			}
		}

		// Sort events alphabetically by event code
		return webhookEvents.sort((a, b) => a.eventCode.localeCompare(b.eventCode));
	}

	private formatEventName(eventCode: string): string {
		// Convert event code to human-readable name
		// e.g., "customer.created" -> "Customer Created"
		return eventCode
			.split('.')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	}

	private extractPayloadSchema(webhookPost: any): string | undefined {
		// Try to extract payload schema from requestBody
		const requestBody = webhookPost.requestBody;
		if (requestBody?.content?.['application/json']?.schema?.$ref) {
			return requestBody.content['application/json'].schema.$ref;
		}
		return undefined;
	}

	private async generateWebhookEventsFile(events: WebhookEvent[]): Promise<void> {
		const eventOptions: WebhookEventOptions[] = events.map((event) => ({
			name: event.name,
			value: event.eventCode,
			description: event.description,
		}));

		const fileContent = `/**
 * Webhook event options for Nalpeiron Trigger
 * Generated automatically from OpenAPI specification
 */

export const WEBHOOK_EVENT_OPTIONS = [
${eventOptions
	.map(
		(option) =>
			`\t{\n\t\tname: '${option.name}',\n\t\tvalue: '${option.value}',\n\t\tdescription: '${this.sanitizeDescription(option.description)}',\n\t},`,
	)
	.join('\n')}
];

/**
 * Get webhook event option by event code
 */
export function getWebhookEventOption(eventCode: string) {
	return WEBHOOK_EVENT_OPTIONS.find(option => option.value === eventCode);
}

/**
 * Get all available webhook event codes
 */
export function getAllWebhookEventCodes(): string[] {
	return WEBHOOK_EVENT_OPTIONS.map(option => option.value);
}

/**
 * Check if an event code is valid
 */
export function isValidWebhookEvent(eventCode: string): boolean {
	return WEBHOOK_EVENT_OPTIONS.some(option => option.value === eventCode);
}
`;

		const outputPath = this.outputDir
			? path.join(this.outputDir, 'webhooks', 'events.ts')
			: path.join(__dirname, '..', 'nodes', 'Nalpeiron', 'Zentitle2', 'webhooks', 'events.ts');
		await this.ensureDirectoryExists(path.dirname(outputPath));
		await fs.writeFile(outputPath, fileContent);
		console.log(`✓ Generated webhook events: ${outputPath}`);
	}

	private async generateWebhookTypesFile(events: WebhookEvent[]): Promise<void> {
		const fileContent = `/**
 * Webhook event type definitions for Nalpeiron
 * Generated automatically from OpenAPI specification
 */

/**
 * Common webhook event structure
 */
export interface WebhookEventBase {
	eventId: string;
	eventDate: string;
	eventCode: string;
	resourceId: string;
	callAttempt: number;
}

/**
 * Complete webhook event with payload
 */
export interface WebhookEvent<T = any> extends WebhookEventBase {
	payload: T;
}

/**
 * Webhook event codes as union type
 */
export type WebhookEventCode = ${events.map((e) => `'${e.eventCode}'`).join(' | ')};

/**
 * Generic payload interface for all webhook events
 */
export interface WebhookPayload {
	[key: string]: any;
}

/**
 * Customer-related webhook payload
 */
export interface CustomerWebhookPayload extends WebhookPayload {
	customerId: string;
	name: string;
	disabled?: boolean;
}

/**
 * Entitlement-related webhook payload
 */
export interface EntitlementWebhookPayload extends WebhookPayload {
	entitlementId: string;
	activatedAt?: string;
	expiresAt?: string;
	daysToExpire?: number;
	maintenanceExpiresAt?: string;
	maintenanceExpiredAt?: string;
}

/**
 * Seat-related webhook payload
 */
export interface SeatWebhookPayload extends WebhookPayload {
	entitlementId: string;
	activationId: string;
	seatId: string;
	seatName?: string;
	seatsUsed?: number;
	isOverdraftSeat?: boolean;
	activatedAt?: string;
	deactivatedAt?: string;
	leaseExpiry?: string;
}
`;

		const outputPath = this.outputDir
			? path.join(this.outputDir, 'webhooks', 'types.ts')
			: path.join(__dirname, '..', 'nodes', 'Nalpeiron', 'Zentitle2', 'webhooks', 'types.ts');
		await this.ensureDirectoryExists(path.dirname(outputPath));
		await fs.writeFile(outputPath, fileContent);
		console.log(`✓ Generated webhook types: ${outputPath}`);
	}

	private sanitizeDescription(description: string): string {
		if (!description) return '';

		return (
			description
				// Replace newlines and tabs with spaces
				.replace(/[\r\n\t]/g, ' ')
				// Replace multiple spaces with single space
				.replace(/\s+/g, ' ')
				// Escape single quotes for TypeScript strings
				.replace(/'/g, "\\'")
				// Escape double quotes
				.replace(/"/g, '\\"')
				// Escape backticks
				.replace(/`/g, '\\`')
				// Remove curly braces entirely (they cause parsing issues)
				.replace(/[{}]/g, '')
				// Remove final period to comply with ESLint rules
				.replace(/\.$/, '')
				// Trim whitespace
				.trim()
				// Limit length to avoid overly long descriptions
				.substring(0, 120) + (description.length > 120 ? '...' : '')
		);
	}

	private async ensureDirectoryExists(dirPath: string): Promise<void> {
		try {
			await fs.access(dirPath);
		} catch {
			await fs.mkdir(dirPath, { recursive: true });
		}
	}
}

// CLI execution
if (require.main === module) {
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

	// Apply product-based defaults
	let finalTags = includeTags;
	let outputDir: string | undefined = customOutput;
	let excludedWebhooks: string[] | undefined;

	if (productName && PRODUCT_CONFIGS[productName]) {
		const productConfig = PRODUCT_CONFIGS[productName];

		// Set tag if not explicitly provided
		if (!includeTags) {
			finalTags = [productConfig.tag];
		}

		// Set output directory if not explicitly provided
		if (!customOutput) {
			outputDir = path.join(__dirname, '..', productConfig.outputDir);
		}

		// Set excluded webhooks from product config
		excludedWebhooks = productConfig.excludedWebhooks;

		console.log(`🎯 Using product configuration: ${productConfig.displayName}`);
	}

	if (finalTags && finalTags.length > 0) {
		console.log(`🏷️  Including only tags: ${finalTags.join(', ')}`);
	}

	if (excludedWebhooks && excludedWebhooks.length > 0) {
		console.log(`🚫 Excluding ${excludedWebhooks.length} webhooks: ${excludedWebhooks.join(', ')}`);
	}

	console.log(`🌐 Using OpenAPI URL: ${openApiPath}`);

	const generator = new WebhookEventGenerator(outputDir, openApiPath);
	generator.generateWebhookEvents(undefined, finalTags, excludedWebhooks).catch(console.error);
}
