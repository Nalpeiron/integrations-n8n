import type { INodeProperties } from 'n8n-workflow';

export const attributeProperties: INodeProperties[] = [
	// Attribute Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['attribute'],
			},
		},
		options: [
			{
				name: 'Get Global Attribute',
				value: 'get',
				description: 'This method returns selected global attribute',
				action: 'Get global attribute',
			},
			{
				name: 'Get Global Attributes List',
				value: 'list',
				description: 'This method returns list of all attributes',
				action: 'Get global attributes list',
			},
		],
		default: 'list',
	},
	// Attribute ID parameter
	{
		displayName: 'Attribute ID',
		name: 'attributeId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The attributeId identifier',
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
				resource: ['attribute'],
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
