import type { INodeProperties } from 'n8n-workflow';

export const featureProperties: INodeProperties[] = [
	// Feature Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['feature'],
			},
		},
		options: [
			{
				name: 'Get Feature',
				value: 'get',
				description: 'This method returns selected global feature',
				action: 'Get feature',
			},
			{
				name: 'List Features',
				value: 'list',
				description: 'This method returns list of all global features',
				action: 'List features',
			},
		],
		default: 'list',
	},
	// Feature ID parameter
	{
		displayName: 'Feature ID',
		name: 'featureId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['feature'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The featureId identifier',
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
				resource: ['feature'],
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
