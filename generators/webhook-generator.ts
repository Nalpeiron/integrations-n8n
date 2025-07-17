import * as fs from 'fs/promises';
import * as path from 'path';
import { OPENAPI_URL, OpenAPIDownloader } from './utils/openapi-downloader';
import { VersionTracker } from './utils/version-tracker';

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

	constructor() {
		this.downloader = new OpenAPIDownloader();
		this.versionTracker = new VersionTracker();
	}

	async generateWebhookEvents(openApiUrl?: string): Promise<void> {
		console.log('🎯 Generating webhook events from OpenAPI spec...');

		// Download OpenAPI specification
		const {
			spec: openApiSpec,
			version,
			tempFilePath,
		} = await this.downloader.downloadSpec(openApiUrl);

		console.log(`📋 Using OpenAPI spec version: ${version}`);

		const apiUrl = openApiUrl || OPENAPI_URL;

		try {
			const webhookEvents = this.extractWebhookEvents(openApiSpec);
			console.log(`📊 Found ${webhookEvents.length} webhook events`);

			await this.generateWebhookEventsFile(webhookEvents);
			await this.generateWebhookTypesFile(webhookEvents);

			// Update version info
			await this.versionTracker.updateComponentVersion(
				'NalpeironZentitle2Trigger',
				apiUrl,
				version,
				{
					generatedBy: 'webhook-generator',
					webhookEventCount: webhookEvents.length,
				},
			);

			console.log('✅ Webhook events generation completed!');
		} finally {
			// Always cleanup temporary file
			await this.downloader.cleanup(tempFilePath);
		}
	}

	private extractWebhookEvents(openApiSpec: any): WebhookEvent[] {
		const webhookEvents: WebhookEvent[] = [];

		// Extract from x-webhooks section
		if (openApiSpec['x-webhooks']) {
			for (const [eventCode, webhookDef] of Object.entries(openApiSpec['x-webhooks'])) {
				const webhookPost = (webhookDef as any).post;
				if (webhookPost) {
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

		const outputPath = path.join(
			__dirname,
			'..',
			'nodes',
			'Nalpeiron',
			'Zentitle2',
			'webhooks',
			'events.ts',
		);
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

		const outputPath = path.join(
			__dirname,
			'..',
			'nodes',
			'Nalpeiron',
			'Zentitle2',
			'webhooks',
			'types.ts',
		);
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
}

// CLI execution
if (require.main === module) {
	const generator = new WebhookEventGenerator();
	generator.generateWebhookEvents().catch(console.error);
}
