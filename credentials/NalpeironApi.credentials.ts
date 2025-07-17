import { ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

export class NalpeironApi implements ICredentialType {
	name = 'nalpeiron-Api';
	displayName = 'Nalpeiron API';
	documentationUrl = 'https://api.nalpeiron.io/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'OAuth2 Client ID for API authentication',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			required: true,
			description: 'OAuth2 Client Secret for API authentication',
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
			displayName: 'OAuth2 Token URL',
			name: 'oauthUrl',
			type: 'string',
			default: '',
			required: true,
			description:
				'The OAuth2 token endpoint URL from your Nalpeiron administration site (should end with /protocol/openid-connect/token)',
			placeholder:
				'https://your-tenant.keycloak.nalpeiron.io/realms/your-tenant/protocol/openid-connect/token',
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
	];
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.oauthUrl}}',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			},
			body: '={{ "grant_type=client_credentials&client_id=" + encodeURIComponent($credentials.clientId) + "&client_secret=" + encodeURIComponent($credentials.clientSecret) }}',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'access_token',
					value: '',
					message: 'OAuth2 credentials are valid! Access token obtained successfully.',
				},
			},
		],
	};
}
