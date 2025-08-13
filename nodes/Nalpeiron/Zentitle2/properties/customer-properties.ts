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
				name: 'Get Contact Credentials',
				value: 'listContactsCredentials',
				description:
					'Return the credentials for a contact. If contact does not have credentials, Authentication field will be null.',
				action: 'Get contact credentials',
			},
			{
				name: 'Get Customer',
				value: 'get',
				description: 'This method returns selected customer',
				action: 'Get customer',
			},
			{
				name: 'Get Customer Contact',
				value: 'getContacts',
				description: 'This method returns selected customer contact details',
				action: 'Get customer contact',
			},
			{
				name: 'Get Customer End User Portal URL',
				value: 'listEup',
				description: 'This method returns customer End User Portal URL',
				action: 'Get customer end user portal url',
			},
			{
				name: 'Get Customer List',
				value: 'list',
				description: 'This method returns list of customers',
				action: 'Get customer list',
			},
			{
				name: 'Get Customer Note',
				value: 'getNotes',
				description: 'This method returns customer note',
				action: 'Get customer note',
			},
			{
				name: 'Get Customer Note List',
				value: 'listNotes',
				description: 'This method returns list of customer notes',
				action: 'Get customer note list',
			},
			{
				name: 'Get Customer Zentitle Statistic',
				value: 'listStats',
				description: 'Return zentitle statistic for a given customer',
				action: 'Get customer zentitle statistic',
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
				operation: [
					'get',
					'getContacts',
					'listContactsCredentials',
					'listEup',
					'listNotes',
					'getNotes',
					'listStats',
				],
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
				operation: ['getContacts', 'listContactsCredentials'],
			},
		},
		default: '',
		description: 'The contactId identifier',
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
