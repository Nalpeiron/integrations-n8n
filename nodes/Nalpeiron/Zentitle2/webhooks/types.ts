/**
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
export type WebhookEventCode =
	| 'customer.created'
	| 'customer.updated'
	| 'entitlement.activated'
	| 'entitlement.created'
	| 'entitlement.expired'
	| 'entitlement.expires1day'
	| 'entitlement.expires30days'
	| 'entitlement.expires7days'
	| 'entitlement.maintenance.expired'
	| 'entitlement.maintenance.expires1day'
	| 'entitlement.maintenance.expires30days'
	| 'entitlement.maintenance.expires7days'
	| 'entitlement.provision'
	| 'entitlement.renewed'
	| 'entitlement.seat.activated'
	| 'entitlement.seat.deactivated'
	| 'entitlement.updated';

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
