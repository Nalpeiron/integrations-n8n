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
				name: 'Create Offering',
				value: 'create',
				description: 'Creates new offering',
				action: 'Create offering',
			},
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
			{
				name: 'Update Offering',
				value: 'update',
				description:
					'This method allows changing selected offering attributes without providing the full payload',
				action: 'Update offering',
			},
		],
		default: 'create',
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
				operation: ['get', 'update'],
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
	// Required field: Concurrency Mode
	{
		displayName: 'Concurrency Mode',
		name: 'requiredBody_concurrencyMode',
		type: 'options',
		required: true,
		default: 'concurrent',
		displayOptions: {
			show: {
				resource: ['offering'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		options: [
			{
				name: 'Concurrent',
				value: 'concurrent',
			},
			{
				name: 'Node Lock',
				value: 'nodeLock',
			},
		],
	},
	// Required field: Edition ID
	{
		displayName: 'Edition ID',
		name: 'requiredBody_editionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['offering'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		description: 'Edition identifier',
	},
	// Required field: Name
	{
		displayName: 'Name',
		name: 'requiredBody_name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['offering'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		description: 'Offering name',
	},
	// Required field: Plan ID
	{
		displayName: 'Plan ID',
		name: 'requiredBody_planId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['offering'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		description: 'Plan identifier',
	},
	// Required field: Seat Count
	{
		displayName: 'Seat Count',
		name: 'requiredBody_seatCount',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['offering'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		description: 'Number of license seats',
	},
	// Required field: Sku
	{
		displayName: 'Sku',
		name: 'requiredBody_sku',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['offering'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		description: 'Offering SKU',
	},
	// Optional request body fields for Create offering
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['offering'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						displayName: 'Field',
						name: 'entries',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Field key',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Field value',
							},
						],
					},
				],
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Offering description',
			},
			{
				displayName: 'Grace Period',
				name: 'gracePeriod',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Count',
						name: 'count',
						type: 'number',
						default: 1,
						description: 'Number of units for interval',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'none',
						options: [
							{
								name: 'Day',
								value: 'day',
							},
							{
								name: 'Hour',
								value: 'hour',
							},
							{
								name: 'Minute',
								value: 'minute',
							},
							{
								name: 'Month',
								value: 'month',
							},
							{
								name: 'None',
								value: 'none',
							},
							{
								name: 'Week',
								value: 'week',
							},
							{
								name: 'Year',
								value: 'year',
							},
						],
					},
				],
			},
			{
				displayName: 'Has Maintenance',
				name: 'hasMaintenance',
				type: 'boolean',
				default: false,
				description: 'Whether maintenance enabled',
			},
			{
				displayName: 'Maintenance Duration',
				name: 'maintenanceDuration',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Count',
						name: 'count',
						type: 'number',
						default: 1,
						description: 'Number of units for interval',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'none',
						options: [
							{
								name: 'Day',
								value: 'day',
							},
							{
								name: 'Hour',
								value: 'hour',
							},
							{
								name: 'Minute',
								value: 'minute',
							},
							{
								name: 'Month',
								value: 'month',
							},
							{
								name: 'None',
								value: 'none',
							},
							{
								name: 'Week',
								value: 'week',
							},
							{
								name: 'Year',
								value: 'year',
							},
						],
					},
				],
			},
			{
				displayName: 'Overdraft Seat Limit',
				name: 'overdraftSeatLimit',
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
				displayName: 'Usage Reset Schedule',
				name: 'usageResetSchedule',
				type: 'options',
				default: 'never',
				options: [
					{
						name: 'Monthly',
						value: 'monthly',
					},
					{
						name: 'Never',
						value: 'never',
					},
					{
						name: 'On Renewal',
						value: 'onRenewal',
					},
				],
			},
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Update offering
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['offering'],
				operation: ['update'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Concurrency Mode',
				name: 'concurrencyMode',
				type: 'options',
				default: 'concurrent',
				options: [
					{
						name: 'Concurrent',
						value: 'concurrent',
					},
					{
						name: 'Node Lock',
						value: 'nodeLock',
					},
				],
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						displayName: 'Field',
						name: 'entries',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Field key',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Field value',
							},
						],
					},
				],
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Offering description',
			},
			{
				displayName: 'Edition ID',
				name: 'editionId',
				type: 'string',
				default: '',
				description: 'Edition identifier',
			},
			{
				displayName: 'Grace Period',
				name: 'gracePeriod',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Count',
						name: 'count',
						type: 'number',
						default: 1,
						description: 'Number of units for interval',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'none',
						options: [
							{
								name: 'Day',
								value: 'day',
							},
							{
								name: 'Hour',
								value: 'hour',
							},
							{
								name: 'Minute',
								value: 'minute',
							},
							{
								name: 'Month',
								value: 'month',
							},
							{
								name: 'None',
								value: 'none',
							},
							{
								name: 'Week',
								value: 'week',
							},
							{
								name: 'Year',
								value: 'year',
							},
						],
					},
				],
			},
			{
				displayName: 'Has Maintenance',
				name: 'hasMaintenance',
				type: 'boolean',
				default: false,
				description: 'Whether maintenance enabled',
			},
			{
				displayName: 'Maintenance Duration',
				name: 'maintenanceDuration',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Count',
						name: 'count',
						type: 'number',
						default: 1,
						description: 'Number of units for interval',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'none',
						options: [
							{
								name: 'Day',
								value: 'day',
							},
							{
								name: 'Hour',
								value: 'hour',
							},
							{
								name: 'Minute',
								value: 'minute',
							},
							{
								name: 'Month',
								value: 'month',
							},
							{
								name: 'None',
								value: 'none',
							},
							{
								name: 'Week',
								value: 'week',
							},
							{
								name: 'Year',
								value: 'year',
							},
						],
					},
				],
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Offering name',
			},
			{
				displayName: 'Overdraft Seat Limit',
				name: 'overdraftSeatLimit',
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
				displayName: 'Plan ID',
				name: 'planId',
				type: 'string',
				default: '',
				description: 'Plan identifier',
			},
			{
				displayName: 'Seat Count',
				name: 'seatCount',
				type: 'number',
				default: 0,
				description: 'Number of license seats',
			},
			{
				displayName: 'Sku',
				name: 'sku',
				type: 'string',
				default: '',
				description: 'Offering SKU',
			},
			{
				displayName: 'Usage Reset Schedule',
				name: 'usageResetSchedule',
				type: 'options',
				default: 'never',
				options: [
					{
						name: 'Monthly',
						value: 'monthly',
					},
					{
						name: 'Never',
						value: 'never',
					},
					{
						name: 'On Renewal',
						value: 'onRenewal',
					},
				],
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
				resource: ['offering'],
				operation: ['create', 'update'],
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
				resource: ['offering'],
				operation: ['create', 'update'],
				useRawJson: [true],
			},
		},
		description: 'Request body data as JSON object',
	},
];
