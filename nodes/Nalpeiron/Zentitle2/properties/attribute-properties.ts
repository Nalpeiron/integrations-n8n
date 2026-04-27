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
				name: 'Create Global Attribute',
				value: 'create',
				description:
					'Create a global attribute that will be included in all entitlements. Default value can be overridden in product or edition level.',
				action: 'Create global attribute',
			},
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
		default: 'create',
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
	// Required field: Key
	{
		displayName: 'Key',
		name: 'requiredBody_key',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		description: 'Attribute unique key',
	},
	// Required field: Type
	{
		displayName: 'Type',
		name: 'requiredBody_type',
		type: 'options',
		required: true,
		default: 'number',
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		options: [
			{
				name: 'Date',
				value: 'date',
			},
			{
				name: 'Number',
				value: 'number',
			},
			{
				name: 'String',
				value: 'string',
			},
		],
	},
	// Optional request body fields for Create global attribute
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Validation Rules',
				name: 'validationRules',
				type: 'json',
				default: '{}',
				description: 'Optional validation rules for the attribute value',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				description: 'Attribute value',
			},
		],
		description: 'Optional request body fields',
	},
	// Raw JSON toggle for create/update operations
	{
		displayName: 'Raw JSON',
		name: 'useRawJson',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['create'],
			},
		},
		description: 'Whether to enter the request body as raw JSON',
	},
	// Raw request body JSON for create/update operations
	{
		displayName: 'Request Body',
		name: 'requestBody',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['attribute'],
				operation: ['create'],
				useRawJson: [true],
			},
		},
		description: 'Request body data as JSON object',
	},
];
