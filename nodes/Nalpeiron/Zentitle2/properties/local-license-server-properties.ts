import type { INodeProperties } from 'n8n-workflow';

export const localLicenseServerProperties: INodeProperties[] = [
	// Local License Server Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['localLicenseServer'],
			},
		},
		options: [
			{
				name: 'Get Local License Server',
				value: 'get',
				description: 'This method returns Local License Server details',
				action: 'Get local license server',
			},
			{
				name: 'List Local License Server Config',
				value: 'listConfig',
				description: "Get Local License Server's configuration",
				action: 'List local license server config',
			},
			{
				name: 'List Local License Server Entitlement',
				value: 'listEntitlement',
				description: 'Get LLS Entitlement for the current tenant',
				action: 'List local license server entitlement',
			},
			{
				name: 'List Local License Servers',
				value: 'list',
				description: 'Returns list of all available local license servers',
				action: 'List local license servers',
			},
		],
		default: 'list',
	},
	// Local License Server ID parameter
	{
		displayName: 'Local License Server ID',
		name: 'localLicenseServerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['localLicenseServer'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The localLicenseServerId identifier',
	},
	// Additional fields for list operations
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['localLicenseServer'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Page Number',
				name: 'pageNumber',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Requested page number',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 10,
				description: 'Maximum number of items per page',
			},
		],
	},
];
