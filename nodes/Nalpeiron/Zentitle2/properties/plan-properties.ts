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
				name: 'Create Plan',
				value: 'create',
				description: 'Creates new plan',
				action: 'Create plan',
			},
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
		default: 'create',
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
	// Required field: License Start Type
	{
		displayName: 'License Start Type',
		name: 'requiredBody_licenseStartType',
		type: 'options',
		required: true,
		default: 'activation',
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		options: [
			{
				name: 'Activation',
				value: 'activation',
			},
			{
				name: 'Custom',
				value: 'custom',
			},
			{
				name: 'Entitlement Creation',
				value: 'entitlementCreation',
			},
			{
				name: 'Manual Activation',
				value: 'manualActivation',
			},
		],
	},
	// Required field: License Type
	{
		displayName: 'License Type',
		name: 'requiredBody_licenseType',
		type: 'options',
		required: true,
		default: 'subscription',
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		options: [
			{
				name: 'Perpetual',
				value: 'perpetual',
			},
			{
				name: 'Subscription',
				value: 'subscription',
			},
		],
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
				resource: ['plan'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		description: 'Name of plan',
	},
	// Optional request body fields for Create plan
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['plan'],
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
				description: 'Plan description',
			},
			{
				displayName: 'License Duration',
				name: 'licenseDuration',
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
				displayName: 'Plan Type',
				name: 'planType',
				type: 'options',
				default: 'trial',
				options: [
					{
						name: 'Beta',
						value: 'beta',
					},
					{
						name: 'Free',
						value: 'free',
					},
					{
						name: 'Internal',
						value: 'internal',
					},
					{
						name: 'Not For Resale',
						value: 'notForResale',
					},
					{
						name: 'Paid',
						value: 'paid',
					},
					{
						name: 'Trial',
						value: 'trial',
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
				resource: ['plan'],
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
				resource: ['plan'],
				operation: ['create'],
				useRawJson: [true],
			},
		},
		description: 'Request body data as JSON object',
	},
];
