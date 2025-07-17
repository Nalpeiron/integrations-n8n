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
				name: 'Get Customer',
				value: 'get',
				description: 'This method returns selected customer',
				action: 'Get customer',
			},
			{
				name: 'Get Customer Notes',
				value: 'getNotes',
				description: 'This method returns customer note',
				action: 'Get customer notes',
			},
			{
				name: 'Get Customer Users',
				value: 'getUsers',
				description: 'This method returns selected end user',
				action: 'Get customer users',
			},
			{
				name: 'List Customer Eup',
				value: 'listEup',
				description: 'This method returns customer End User Portal URL',
				action: 'List customer eup',
			},
			{
				name: 'List Customer Notes',
				value: 'listNotes',
				description: 'This method returns list of customer notes',
				action: 'List customer notes',
			},
			{
				name: 'List Customer Users',
				value: 'listUsers',
				description: 'This method returns list of end users',
				action: 'List customer users',
			},
			{
				name: 'List Customers',
				value: 'list',
				description: 'This method returns list of customers',
				action: 'List customers',
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
				operation: ['get', 'listEup', 'listNotes', 'getNotes', 'listUsers', 'getUsers'],
			},
		},
		default: '',
		description: 'The customerId identifier',
	},
	// Note ID parameter
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getNotes'],
			},
		},
		default: '',
		description: 'The noteId identifier',
	},
	// User ID parameter
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['getUsers'],
			},
		},
		default: '',
		description: 'The userId identifier',
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
