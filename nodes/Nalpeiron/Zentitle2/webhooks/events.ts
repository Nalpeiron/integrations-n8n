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
	{
		name: 'Entitlement Activated',
		value: 'entitlement.activated',
		description: 'Event generated when entitlement was successfully activated',
	},
	{
		name: 'Entitlement Created',
		value: 'entitlement.created',
		description: 'Event generated when entitlement was successfully created',
	},
	{
		name: 'Entitlement Expired',
		value: 'entitlement.expired',
		description: 'Event generated when entitlement has expired',
	},
	{
		name: 'Entitlement Expires1day',
		value: 'entitlement.expires1day',
		description: 'Event generated when entitlement is going to expire in 1 day',
	},
	{
		name: 'Entitlement Expires30days',
		value: 'entitlement.expires30days',
		description: 'Event generated when entitlement is going to expire in 30 days',
	},
	{
		name: 'Entitlement Expires7days',
		value: 'entitlement.expires7days',
		description: 'Event generated when entitlement is going to expire in 7 days',
	},
	{
		name: 'Entitlement Maintenance Expired',
		value: 'entitlement.maintenance.expired',
		description: 'Event generated when entitlement maintenance has expired',
	},
	{
		name: 'Entitlement Maintenance Expires1day',
		value: 'entitlement.maintenance.expires1day',
		description: 'Event generated when entitlement maintenance is going to expire in 1 day',
	},
	{
		name: 'Entitlement Maintenance Expires30days',
		value: 'entitlement.maintenance.expires30days',
		description: 'Event generated when entitlement maintenance is going to expire in 30 days',
	},
	{
		name: 'Entitlement Maintenance Expires7days',
		value: 'entitlement.maintenance.expires7days',
		description: 'Event generated when entitlement maintenance is going to expire in 7 days',
	},
	{
		name: 'Entitlement Provision',
		value: 'entitlement.provision',
		description:
			'Event generated from UI or ManagementAPI to start provisioning process in the integration service',
	},
	{
		name: 'Entitlement Renewed',
		value: 'entitlement.renewed',
		description: 'Event generated when entitlement was successfully renewed',
	},
	{
		name: 'Entitlement Seat Activated',
		value: 'entitlement.seat.activated',
		description: "Event generated when the entitlement's seat was successfully activated",
	},
	{
		name: 'Entitlement Seat Deactivated',
		value: 'entitlement.seat.deactivated',
		description: "Event generated when the entitlement's seat was successfully deactivated",
	},
	{
		name: 'Entitlement Updated',
		value: 'entitlement.updated',
		description: 'Event generated when entitlement was updated',
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
