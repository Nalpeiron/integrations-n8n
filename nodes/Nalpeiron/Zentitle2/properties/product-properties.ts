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
				name: 'Get Product',
				value: 'get',
				description: 'This method returns product details',
				action: 'Get product',
			},
			{
				name: 'Get Product Attributes',
				value: 'getAttributes',
				description:
					'This method returns selected attribute. In case of global attribute, if overridden value exists on product level, it wil...',
				action: 'Get product attributes',
			},
			{
				name: 'Get Product Editions',
				value: 'getEditions',
				description: 'This method returns product edition details',
				action: 'Get product editions',
			},
			{
				name: 'Get Product Editions Attributes',
				value: 'getEditionsAttributes',
				description:
					'This method returns selected attribute with value defined in edition level (in case of override). If no value is defined...',
				action: 'Get product editions attributes',
			},
			{
				name: 'Get Product Editions Features',
				value: 'getEditionsFeatures',
				description:
					'This method returns selected feature with value defined in edition level (in case of override). If no value is defined i...',
				action: 'Get product editions features',
			},
			{
				name: 'Get Product Features',
				value: 'getFeatures',
				description:
					'This method returns selected feature. In case of global feature, if overridden value exists on product level, it will be...',
				action: 'Get product features',
			},
			{
				name: 'List Product Attributes',
				value: 'listAttributes',
				description: 'This method returns list of all attributes for selected product',
				action: 'List product attributes',
			},
			{
				name: 'List Product Editions',
				value: 'listEditions',
				description:
					'This method returns list of editions that can be filtered by following query parameters',
				action: 'List product editions',
			},
			{
				name: 'List Product Editions Attributes',
				value: 'listEditionsAttributes',
				description: 'This method returns list of all attributes for selected edition',
				action: 'List product editions attributes',
			},
			{
				name: 'List Product Editions Features',
				value: 'listEditionsFeatures',
				description: 'This method returns list of all features for selected edition',
				action: 'List product editions features',
			},
			{
				name: 'List Product Features',
				value: 'listFeatures',
				description: 'This method returns list of all features for selected product',
				action: 'List product features',
			},
			{
				name: 'List Products',
				value: 'list',
				description:
					'This method returns list of products that can be filtered by following query parameters',
				action: 'List products',
			},
		],
		default: 'list',
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
					'listAttributes',
					'getAttributes',
					'listEditions',
					'getEditions',
					'listEditionsAttributes',
					'getEditionsAttributes',
					'listEditionsFeatures',
					'getEditionsFeatures',
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
				operation: ['getAttributes', 'getEditionsAttributes'],
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
];
