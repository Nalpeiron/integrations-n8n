import type { INodeProperties } from 'n8n-workflow';

export const productProperties: INodeProperties[] = [
	// Product Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Create Edition',
				value: 'createEditions',
				description: 'Creates new product edition',
				action: 'Create edition',
			},
			{
				name: 'Create Product',
				value: 'create',
				description: 'Creates a new product with default settings',
				action: 'Create product',
			},
			{
				name: 'Create Product Attribute',
				value: 'createAttributes',
				description:
					'Create new product attribute. Value defined for this attribute can be overridden in each edition if required.',
				action: 'Create product attribute',
			},
			{
				name: 'Create Product Feature',
				value: 'createFeatures',
				description:
					'Create new product feature. Value defined for this feature can be overridden in each edition if required.',
				action: 'Create product feature',
			},
			{
				name: 'Get a Product List',
				value: 'list',
				description:
					'This method returns a list of products that can be filtered by following query parameters',
				action: 'Get a product list',
			},
			{
				name: 'Get Edition',
				value: 'getEditions',
				description: 'This method returns product edition details',
				action: 'Get edition',
			},
			{
				name: 'Get Edition Attribute',
				value: 'getEditionsAttributes',
				description:
					'This method returns selected attribute with value defined in edition level (in case of override). If no value is defined in edition level, value defined in higher level is returned.',
				action: 'Get edition attribute',
			},
			{
				name: 'Get Edition Attributes List',
				value: 'listEditionsAttributes',
				description: 'This method returns list of all attributes for selected edition',
				action: 'Get edition attributes list',
			},
			{
				name: 'Get Edition Feature',
				value: 'getEditionsFeatures',
				description:
					'This method returns selected feature with value defined in edition level (in case of override). If no value is defined in edition level, value defined in higher level is returned.',
				action: 'Get edition feature',
			},
			{
				name: 'Get Edition Feature List',
				value: 'listEditionsFeatures',
				description: 'This method returns list of all features for selected edition',
				action: 'Get edition feature list',
			},
			{
				name: 'Get Edition List',
				value: 'listEditions',
				description:
					'This method returns list of editions that can be filtered by following query parameters',
				action: 'Get edition list',
			},
			{
				name: 'Get Product',
				value: 'get',
				description: 'This method returns product details',
				action: 'Get product',
			},
			{
				name: 'Get Product Attribute',
				value: 'getAttributes',
				description:
					'This method returns selected attribute. In case of global attribute, if overridden value exists on product level, it will be returned, otherwise global value will be returned.',
				action: 'Get product attribute',
			},
			{
				name: 'Get Product Attributes List',
				value: 'listAttributes',
				description: 'This method returns list of all attributes for selected product',
				action: 'Get product attributes list',
			},
			{
				name: 'Get Product Feature',
				value: 'getFeatures',
				description:
					'This method returns selected feature. In case of global feature, if overridden value exists on product level, it will be returned, otherwise global value will be returned.',
				action: 'Get product feature',
			},
			{
				name: 'Get Product Features List',
				value: 'listFeatures',
				description: 'This method returns list of all features for selected product',
				action: 'Get product features list',
			},
			{
				name: 'Update Edition Attribute',
				value: 'updateEditionsAttributes',
				description:
					'This method allows to change value of selected attribute for specific edition. This method can be used to override default value of global and products attributes.',
				action: 'Update edition attribute',
			},
			{
				name: 'Update Product',
				value: 'update',
				description:
					'This method allows updating selected product properties. At least one property has to be provided, otherwise the request will be rejected.',
				action: 'Update product',
			},
			{
				name: 'Update Product Attribute Value',
				value: 'updateAttributes',
				description:
					'This method can be used to change value of selected product attribute. This method can be used to override default value of global attributes for each product separately.',
				action: 'Update product attribute value',
			},
		],
		default: 'create',
	},
	// Product ID parameter
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: [
					'get',
					'update',
					'createAttributes',
					'listAttributes',
					'getAttributes',
					'updateAttributes',
					'createEditions',
					'listEditions',
					'getEditions',
					'listEditionsAttributes',
					'getEditionsAttributes',
					'updateEditionsAttributes',
					'listEditionsFeatures',
					'getEditionsFeatures',
					'createFeatures',
					'listFeatures',
					'getFeatures',
				],
			},
		},
		default: '',
		description: 'The productId identifier',
	},
	// Attribute ID parameter
	{
		displayName: 'Attribute ID',
		name: 'attributeId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: [
					'getAttributes',
					'updateAttributes',
					'getEditionsAttributes',
					'updateEditionsAttributes',
				],
			},
		},
		default: '',
		description: 'The attributeId identifier',
	},
	// Edition ID parameter
	{
		displayName: 'Edition ID',
		name: 'editionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: [
					'getEditions',
					'listEditionsAttributes',
					'getEditionsAttributes',
					'updateEditionsAttributes',
					'listEditionsFeatures',
					'getEditionsFeatures',
				],
			},
		},
		default: '',
		description: 'The editionId identifier',
	},
	// Feature ID parameter
	{
		displayName: 'Feature ID',
		name: 'featureId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['getEditionsFeatures', 'getFeatures'],
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
				resource: ['product'],
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
	// Required field: Name
	{
		displayName: 'Name',
		name: 'requiredBody_name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		description: 'Name of product',
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
				resource: ['product'],
				operation: ['createAttributes'],
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
				resource: ['product'],
				operation: ['createAttributes'],
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
	// Required field: Name
	{
		displayName: 'Name',
		name: 'requiredBody_name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['createEditions'],
				useRawJson: [false],
			},
		},
		description: 'Edition name',
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
				resource: ['product'],
				operation: ['createFeatures'],
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
				resource: ['product'],
				operation: ['createFeatures'],
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
	// Optional request body fields for Create product
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
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
				description: 'Product description',
			},
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Update product
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Product description',
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
				displayName: 'Lease Period',
				name: 'leasePeriod',
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
				description: 'Name of product',
			},
			{
				displayName: 'Offline Lease Period',
				name: 'offlineLeasePeriod',
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
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Create product attribute
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['createAttributes'],
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
	// Optional request body fields for Update product attribute value
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['updateAttributes'],
				useRawJson: [false],
			},
		},
		options: [
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
	// Optional request body fields for Create edition
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['createEditions'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Edition description',
			},
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Update edition attribute
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['updateEditionsAttributes'],
				useRawJson: [false],
			},
		},
		options: [
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
	// Optional request body fields for Create product feature
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['createFeatures'],
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
				resource: ['product'],
				operation: [
					'create',
					'update',
					'createAttributes',
					'updateAttributes',
					'createEditions',
					'updateEditionsAttributes',
					'createFeatures',
				],
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
				resource: ['product'],
				operation: [
					'create',
					'update',
					'createAttributes',
					'updateAttributes',
					'createEditions',
					'updateEditionsAttributes',
					'createFeatures',
				],
				useRawJson: [true],
			},
		},
		description: 'Request body data as JSON object',
	},
];
