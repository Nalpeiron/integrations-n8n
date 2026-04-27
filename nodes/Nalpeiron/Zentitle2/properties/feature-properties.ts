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
				name: 'Create Global Feature',
				value: 'create',
				description:
					'Create a global feature that will be included in all entitlements. Default value can be overridden in product or edition level.',
				action: 'Create global feature',
			},
			{
				name: 'Get Global Feature',
				value: 'get',
				description: 'This method returns selected global feature',
				action: 'Get global feature',
			},
			{
				name: 'Get Global Features List',
				value: 'list',
				description: 'This method returns list of all global features',
				action: 'Get global features list',
			},
		],
		default: 'create',
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
	// Required field: Key
	{
		displayName: 'Key',
		name: 'requiredBody_key',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['feature'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		description: 'Feature unique key',
	},
	// Required field: Type
	{
		displayName: 'Type',
		name: 'requiredBody_type',
		type: 'options',
		required: true,
		default: 'bool',
		displayOptions: {
			show: {
				resource: ['feature'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		options: [
			{
				name: 'Bool',
				value: 'bool',
			},
			{
				name: 'Element Pool',
				value: 'elementPool',
			},
			{
				name: 'Usage Count',
				value: 'usageCount',
			},
		],
	},
	// Optional request body fields for Create global feature
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['feature'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Feature description',
			},
			{
				displayName: 'Overdraft Limit',
				name: 'overdraftLimit',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'none',
						options: [
							{
								name: 'Absolute',
								value: 'absolute',
							},
							{
								name: 'None',
								value: 'none',
							},
							{
								name: 'Percentage',
								value: 'percentage',
							},
							{
								name: 'Unlimited',
								value: 'unlimited',
							},
						],
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'number',
						default: 2,
						description: 'Overdraft limit value',
					},
				],
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'number',
				default: 0,
				description: 'Default feature value',
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
				resource: ['feature'],
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
				resource: ['feature'],
				operation: ['create'],
				useRawJson: [true],
			},
		},
		description: 'Request body data as JSON object',
	},
];
