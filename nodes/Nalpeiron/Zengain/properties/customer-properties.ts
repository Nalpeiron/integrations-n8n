import type { INodeProperties } from 'n8n-workflow';

export const customerProperties: INodeProperties[] = [
	// Customer Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customer'],
			},
		},
		options: [
			{
				name: 'Get a Customer Contact List',
				value: 'listContacts',
				description: 'This method returns a list of customer contacts',
				action: 'Get a customer contact list',
			},
			{
				name: 'Get Customer',
				value: 'get',
				description: 'This method returns the selected customer',
				action: 'Get customer',
			},
			{
				name: 'Get Customer Contact',
				value: 'getContacts',
				description: 'This method returns selected customer contact details',
				action: 'Get customer contact',
			},
			{
				name: 'Get Customer List',
				value: 'list',
				description: 'This method returns list of customers',
				action: 'Get customer list',
			},
		],
		default: 'list',
	},
	// Customer ID parameter
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['get', 'listContacts', 'getContacts'],
			},
		},
		default: '',
		description: 'The customerId identifier',
	},
	// Contact ID parameter
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getContacts'],
			},
		},
		default: '',
		description: 'The contactId identifier',
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
				resource: ['customer'],
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
