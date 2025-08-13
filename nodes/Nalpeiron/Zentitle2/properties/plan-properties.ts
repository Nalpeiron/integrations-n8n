import type { INodeProperties } from 'n8n-workflow';

export const planProperties: INodeProperties[] = [
	// Plan Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['plan'],
			},
		},
		options: [
			{
				name: 'Get Plan',
				value: 'get',
				description: 'This method returns plan details',
				action: 'Get plan',
			},
			{
				name: 'Get Plan List',
				value: 'list',
				description:
					'This method returns list of plans that can be filtered by following query parameters',
				action: 'Get plan list',
			},
		],
		default: 'list',
	},
	// Plan ID parameter
	{
		displayName: 'Plan ID',
		name: 'planId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The planId identifier',
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
				resource: ['plan'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Page Number',
				name: 'pageNumber',
				type: 'number',
				default: '',
				description: 'Requested page number',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: '',
				description: 'Maximum number of items per page',
			},
		],
	},
];
