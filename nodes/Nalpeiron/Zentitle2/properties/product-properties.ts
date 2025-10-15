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
