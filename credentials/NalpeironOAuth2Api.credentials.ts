import type { ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * Nalpeiron API credential with OAuth2 client credentials flow
 * Extends oAuth2Api for OAuth2 token management
 * Custom header (N-TenantId) is added in node code
 */
export class NalpeironOAuth2Api implements ICredentialType {
	name = 'nalpeironOAuth2Api';
	displayName = 'Nalpeiron OAuth2 API';
	documentationUrl = 'https://api.nalpeiron.io/docs';
	extends = ['oAuth2Api'];

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'string',
			default: '',
			required: true,
			description:
				'The OAuth2 token endpoint URL from your Nalpeiron administration site (should end with /protocol/openid-connect/token)',
			placeholder:
				'https://your-tenant.keycloak.nalpeiron.io/realms/your-tenant/protocol/openid-connect/token',
		},
		{
			displayName: 'Tenant ID',
			name: 'tenantId',
			type: 'string',
			default: '',
			required: true,
			description: 'The tenant identifier (e.g., t_KRwhRp1yl0_9gsZjE5Yjaw)',
			placeholder: 't_KRwhRp1yl0_9gsZjE5Yjaw',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://{tenant}.api.nalpeiron.io',
			description: 'The base URL for the Nalpeiron Growth Platform API',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'clientCredentials',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'openid',
			description: 'OAuth2 scope',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
		{
			displayName: 'Send Additional Body Properties',
			name: 'sendAdditionalBodyProperties',
			type: 'hidden',
			default: false,
		},
		{
			displayName: 'Additional Body Properties',
			name: 'additionalBodyProperties',
			type: 'hidden',
			default: '',
		},
	];
}
