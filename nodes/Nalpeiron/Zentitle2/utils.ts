import { IRequestOptions, IDataObject, NodeOperationError, INode } from 'n8n-workflow';

export interface INalpeironCredentials {
	baseUrl: string;
	tenantId: string;
	clientId: string;
	clientSecret: string;
	oauthUrl: string;
	rsaPublicKey?: string;
}

export interface IRequestHelpers {
	request: (options: IRequestOptions) => Promise<any>;
}

/**
 * Get OAuth2 access token from Nalpeiron
 */
export async function getOAuth2AccessToken(
	credentials: INalpeironCredentials,
	helpers: IRequestHelpers,
	node: INode,
): Promise<string> {
	const tokenUrl = credentials.oauthUrl;
	const formData = `grant_type=client_credentials&client_id=${encodeURIComponent(
		credentials.clientId,
	)}&client_secret=${encodeURIComponent(credentials.clientSecret)}`;

	const options: IRequestOptions = {
		method: 'POST',
		url: tokenUrl,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
		},
		body: formData,
		json: false, // Don't auto-parse JSON since we're sending form data
	};

	try {
		const response = await helpers.request(options);

		// Parse response manually since we set json: false
		const responseData = typeof response === 'string' ? JSON.parse(response) : response;

		if (!responseData.access_token) {
			throw new NodeOperationError(
				node,
				`Failed to obtain OAuth2 access token: No access_token in response. Response: ${JSON.stringify(
					responseData,
				)}`,
			);
		}
		return responseData.access_token;
	} catch (error) {
		// Enhanced error reporting for debugging
		const errorMessage = error.response?.body || error.message || String(error);
		throw new NodeOperationError(
			node,
			`OAuth2 authentication failed (URL: ${tokenUrl}): ${errorMessage}`,
		);
	}
}

/**
 * Make authenticated request to Nalpeiron API
 */
export async function makeAuthenticatedRequest(
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	endpoint: string,
	accessToken: string,
	credentials: INalpeironCredentials,
	helpers: IRequestHelpers,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<any> {
	const options: IRequestOptions = {
		method,
		url: `${credentials.baseUrl}${endpoint}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
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

	return await helpers.request(options);
}

/**
 * Helper function specifically for webhook management (used in trigger node)
 */
export async function makeWebhookRequest(
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	endpoint: string,
	accessToken: string,
	credentials: INalpeironCredentials,
	helpers: IRequestHelpers,
	body?: IDataObject,
): Promise<any> {
	return makeAuthenticatedRequest(method, endpoint, accessToken, credentials, helpers, body);
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
