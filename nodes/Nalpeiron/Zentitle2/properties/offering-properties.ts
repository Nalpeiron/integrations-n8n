import type { INodeProperties } from 'n8n-workflow';

export const offeringProperties: INodeProperties[] = [
	// Offering Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['offering'],
			},
		},
		options: [
			{
				name: 'Get Offering',
				value: 'get',
				description: 'This method returns offering details',
				action: 'Get offering',
			},
			{
				name: 'Get Offering List',
				value: 'list',
				description:
					'This method returns list of offering that can be filtered by the following query parameters',
				action: 'Get offering list',
			},
		],
		default: 'list',
	},
	// Offering ID parameter
	{
		displayName: 'Offering ID',
		name: 'offeringId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['offering'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The offeringId identifier',
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
				resource: ['offering'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Expand',
				name: 'expand',
				type: 'string',
				default: '',
				description: 'Expand configuration',
			},
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
			{
				displayName: 'Plan ID',
				name: 'planId',
				type: 'string',
				default: '',
				description: 'Optional plan identifier',
			},
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				default: '',
				description: 'Optional product identifier',
			},
		],
	},
];
