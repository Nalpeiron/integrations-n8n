/**
 * Webhook event options for Nalpeiron Trigger
 * Generated automatically from OpenAPI specification
 */

export const WEBHOOK_EVENT_OPTIONS = [
	{
		name: 'Customer Created',
		value: 'customer.created',
		description: 'Event generated when customer was successfully created',
	},
	{
		name: 'Customer Updated',
		value: 'customer.updated',
		description: 'Event generated when customer was successfully updated',
	},
];

/**
 * Get webhook event option by event code
 */
export function getWebhookEventOption(eventCode: string) {
	return WEBHOOK_EVENT_OPTIONS.find((option) => option.value === eventCode);
}

/**
 * Get all available webhook event codes
 */
export function getAllWebhookEventCodes(): string[] {
	return WEBHOOK_EVENT_OPTIONS.map((option) => option.value);
}

/**
 * Check if an event code is valid
 */
export function isValidWebhookEvent(eventCode: string): boolean {
	return WEBHOOK_EVENT_OPTIONS.some((option) => option.value === eventCode);
}
