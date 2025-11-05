import { IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import type { IExecuteFunctions, IHookFunctions } from 'n8n-workflow';

export interface INalpeironCredentials {
	baseUrl: string;
	tenantId: string;
	clientId: string;
	clientSecret: string;
	accessTokenUrl: string;
	rsaPublicKey?: string;
}

/**
 * Make authenticated request to Nalpeiron API
 * Uses httpRequestWithAuthentication which triggers the credential's OAuth2 handling
 * Custom header (N-TenantId) is added here before authentication
 */
export async function makeAuthenticatedRequest(
	context: IExecuteFunctions | IHookFunctions,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<any> {
	const credentials = (await context.getCredentials('nalpeironOAuth2Api')) as INalpeironCredentials;

	const options: IHttpRequestOptions = {
		method,
		url: `${credentials.baseUrl}${endpoint}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'N-TenantId': credentials.tenantId,
		},
		json: true,
	};

	if (body) {
		options.body = body;
	}

	if (qs) {
		options.qs = qs;
	}

	return await context.helpers.httpRequestWithAuthentication.call(
		context,
		'nalpeironOAuth2Api',
		options,
	);
}

/**
 * Helper function specifically for webhook management (used in trigger node)
 */
export async function makeWebhookRequest(
	context: IHookFunctions,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	endpoint: string,
	body?: IDataObject,
): Promise<any> {
	return makeAuthenticatedRequest(context, method, endpoint, body);
}

/**
 * Prepare response headers
 */
export function prepareResponseHeaders(): { [key: string]: string } {
	const responseHeaders: { [key: string]: string } = {
		'Content-Type': 'application/json',
	};

	return responseHeaders;
}

/**
 * Extract event type from webhook body data
 */
export function extractEventType(bodyData: any): string {
	return String(bodyData?.eventCode || bodyData?.event || bodyData?.type || 'unknown');
}

/**
 * Prepare webhook response data
 */
export function prepareWebhookResponse(
	bodyData: any,
	headerData: any,
	queryData: any,
	eventType: string,
): any {
	const propertyName = 'data';
	return {
		[propertyName]: bodyData,
		headers: headerData,
		query: queryData,
		event: eventType,
		timestamp: new Date().toISOString(),
	};
}
