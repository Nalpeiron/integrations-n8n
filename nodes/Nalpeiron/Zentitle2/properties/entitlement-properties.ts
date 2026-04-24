import type { INodeProperties } from 'n8n-workflow';

export const entitlementProperties: INodeProperties[] = [
	// Entitlement Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['entitlement'],
			},
		},
		options: [
			{
				name: 'Activate Entitlement',
				value: 'updateActivate',
				description:
					'This method change state of entitlement that seats can be activated. Depending of offering configuration entitlement can be activated during entitlement creation.',
				action: 'Activate entitlement',
			},
			{
				name: 'Add Activation Codes',
				value: 'updateGroupsActivationCodesAdd',
				description: 'This method will add activation codes to the entitlement group',
				action: 'Add activation codes',
			},
			{
				name: 'Assign Contact to Entitlement Group',
				value: 'createGroupsAuthorizedContacts',
				description:
					'This method assigns a contact (with ABL credentials) to the entitlement group. If contact is already part of the entitlement group, the request will be ignored and complete successfully. Adding a contact which does not have ABL credentials ...',
				action: 'Assign contact to entitlement group',
			},
			{
				name: 'Change Entitlement Offering',
				value: 'updateChangeOffering',
				description:
					'This method allows the change of an entitlement offering. This method can only modify the entitlement to a different offering if the new offering belongs to the same product. If the new offering has a lower seat count than the seats current...',
				action: 'Change entitlement offering',
			},
			{
				name: 'Checkout Activation Feature',
				value: 'updateActivationsFeaturesCheckout',
				description:
					'This method checkouts some amount feature. Feature can be used permanently (usage count) or can be returned (element pool) using return feature method.',
				action: 'Checkout activation feature',
			},
			{
				name: 'Create Activation',
				value: 'createActivations',
				description:
					'Activate entitlement for provided seat ID and create activation that can be used feature management This method will work only when entitlement was created before create activation is called',
				action: 'Create activation',
			},
			{
				name: 'Create an Entitlement Group',
				value: 'createGroups',
				description:
					'Create an entitlement group providing a list of product SKUs. For each SKU provided an entitlement will be created within the entitlement group. All other parameters are optional. Activation code is also optional, and if not provided, it wi...',
				action: 'Create an entitlement group',
			},
			{
				name: 'Create Entitlement Note',
				value: 'createNotes',
				description: 'Creates new entitlement note',
				action: 'Create entitlement note',
			},
			{
				name: 'Disable Entitlement',
				value: 'updateDisable',
				description: 'This method disables entitlement. Disabled entitlement cannot be activated.',
				action: 'Disable entitlement',
			},
			{
				name: 'Enable Entitlement',
				value: 'updateEnable',
				description:
					'This method re-enables entitlement. Enabled entitlement can be used normally.',
				action: 'Enable entitlement',
			},
			{
				name: 'Extend Entitlement Group',
				value: 'createGroupsExtend',
				description:
					'Extend an existing entitlement group by adding new entitlements based on the provided SKUs. This will add additional entitlements to the existing entitlement group.',
				action: 'Extend entitlement group',
			},
			{
				name: 'Find Entitlement Group by Activation Code',
				value: 'createGroupsFind',
				description:
					'This endpoint looks up an entitlement group using an activation code and product identifier',
				action: 'Find entitlement group by activation code',
			},
			{
				name: 'Generate Activation Codes',
				value: 'updateGroupsActivationCodesGenerate',
				description: 'This method will generate new codes and add them to the entitlement group',
				action: 'Generate activation codes',
			},
			{
				name: 'Get Activation State',
				value: 'getActivations',
				description:
					'This method returns activation details including information about attributes and available features',
				action: 'Get activation state',
			},
			{
				name: 'Get an Entitlement Group',
				value: 'getGroups',
				description:
					'This method returns entitlement group details. The amount of data returned can be adjusted by using query expand parameter configuration.',
				action: 'Get an entitlement group',
			},
			{
				name: 'Get Entitlement',
				value: 'get',
				description: 'This method returns entitlement details',
				action: 'Get entitlement',
			},
			{
				name: 'Get Entitlement Group Authorized Contacts',
				value: 'listGroupsAuthorizedContacts',
				description:
					'This method returns list of contacts (with ABL credentials) authorized for the entitlement group',
				action: 'Get entitlement group authorized contacts',
			},
			{
				name: 'Get Entitlement Group List',
				value: 'listGroups',
				description:
					'This method returns entitlement group list. Amount of data returned can be adjusted by using query expand parameter configuration.',
				action: 'Get entitlement group list',
			},
			{
				name: 'Get Entitlement List',
				value: 'list',
				description:
					'This method returns list of entitlements that can be filtered by following query parameters',
				action: 'Get entitlement list',
			},
			{
				name: 'Get Entitlement Note',
				value: 'getNotes',
				description: 'This method returns entitlement note',
				action: 'Get entitlement note',
			},
			{
				name: 'Get Entitlement Note List',
				value: 'listNotes',
				description: 'This method returns list of entitlement notes',
				action: 'Get entitlement note list',
			},
			{
				name: 'List of Entitlement Activations',
				value: 'listActivations',
				description:
					'This method returns list of entitlement activation that can be filtered by following query parameters',
				action: 'List of entitlement activations',
			},
			{
				name: 'Log of Activations Activity',
				value: 'listActivationsLog',
				description: 'This method returns log of activations activity on the entitlement',
				action: 'Log of activations activity',
			},
			{
				name: 'Refresh Activation',
				value: 'updateActivations',
				description:
					'Refresh lease time of provided seat activation When activation lease expiry already equals entitlement expiry, next and any subsequent refreshes will fail since the activation cannot be extended beyond the entitlement expiry',
				action: 'Refresh activation',
			},
			{
				name: 'Remove Activation Codes',
				value: 'updateGroupsActivationCodesRemove',
				description: 'This method will remove activation codes from the entitlement group',
				action: 'Remove activation codes',
			},
			{
				name: 'Renew Entitlement',
				value: 'updateRenew',
				description:
					'Renews a subscription entitlement. This method is specially designed for renewal of previously activated subscription entitlements. The new expiry date is determined using following rules: * If the expiration date has passed but the grace p...',
				action: 'Renew entitlement',
			},
			{
				name: 'Reset Entitlement Overrides',
				value: 'updateResetOverrides',
				description:
					'This method allows to reset entitlement overrides to match current product configuration. Each field can be reset individually by setting corresponding field to true. This method can also to restore current configuration for features and at...',
				action: 'Reset entitlement overrides',
			},
			{
				name: 'Reset Usage Count of a Feature',
				value: 'updateFeatureReset',
				description: 'Only usage count features can be reset',
				action: 'Reset usage count of a feature',
			},
			{
				name: 'Return Activation Feature',
				value: 'updateActivationsFeaturesReturn',
				description:
					'This method returns amount of feature. Only element pool features are allowed to be returned.',
				action: 'Return activation feature',
			},
			{
				name: 'Trigger Provision Event',
				value: 'createProvision',
				description: 'This method triggers provision webhook event for the entitlement',
				action: 'Trigger provision event',
			},
			{
				name: 'Update Entitlement',
				value: 'update',
				description:
					'Allows to change settings of selected entitlement, including attributes and features. Only provided features and attributes will be processed. If the caller has no intentions to update features or attributes those field can be sent as null ...',
				action: 'Update entitlement',
			},
			{
				name: 'Update Entitlement Group',
				value: 'updateGroups',
				description: 'Entitlement group update',
				action: 'Update entitlement group',
			},
		],
		default: 'list',
	},
	// Entitlement ID parameter
	{
		displayName: 'Entitlement ID',
		name: 'entitlementId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: [
					'get',
					'update',
					'updateActivate',
					'listActivations',
					'listActivationsLog',
					'updateChangeOffering',
					'updateDisable',
					'updateEnable',
					'updateFeatureReset',
					'createNotes',
					'listNotes',
					'getNotes',
					'createProvision',
					'updateRenew',
					'updateResetOverrides',
				],
			},
		},
		default: '',
		description: 'The entitlementId identifier',
	},
	// Feature ID parameter
	{
		displayName: 'Feature ID',
		name: 'featureId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateFeatureReset'],
			},
		},
		default: '',
		description: 'The featureId identifier',
	},
	// Note ID parameter
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['getNotes'],
			},
		},
		default: '',
		description: 'The noteId identifier',
	},
	// Activation ID parameter
	{
		displayName: 'Activation ID',
		name: 'activationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: [
					'getActivations',
					'updateActivationsFeaturesCheckout',
					'updateActivationsFeaturesReturn',
				],
			},
		},
		default: '',
		description: 'The activationId identifier',
	},
	// Entitlement Group ID parameter
	{
		displayName: 'Entitlement Group ID',
		name: 'entitlementGroupId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: [
					'getGroups',
					'updateGroups',
					'updateGroupsActivationCodesAdd',
					'updateGroupsActivationCodesGenerate',
					'updateGroupsActivationCodesRemove',
					'createGroupsAuthorizedContacts',
					'listGroupsAuthorizedContacts',
					'createGroupsExtend',
				],
			},
		},
		default: '',
		description: 'The entitlementGroupId identifier',
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
				resource: ['entitlement'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				description: 'Customer identifier',
			},
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
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				default: '',
				description: 'Product identifier',
			},
		],
	},
	// Required field: Offering ID
	{
		displayName: 'Offering ID',
		name: 'requiredBody_offeringId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateChangeOffering'],
				useRawJson: [false],
			},
		},
		description: 'Offering identifier',
	},
	// Required field: Note
	{
		displayName: 'Note',
		name: 'requiredBody_note',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createNotes'],
				useRawJson: [false],
			},
		},
		description: 'Entitlement note',
	},
	// Required field: Activation Credentials
	{
		displayName: 'Activation Credentials',
		name: 'requiredBody_activationCredentials',
		type: 'collection',
		required: true,
		default: { type: 'activationCode' },
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createActivations'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Code',
				name: 'code',
				type: 'string',
				default: '',
				description: 'Activation code',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'OpenID JWT token',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'activationCode',
				options: [
					{
						name: 'Activation Code',
						value: 'activationCode',
					},
					{
						name: 'Open ID Token',
						value: 'openIdToken',
					},
					{
						name: 'Password',
						value: 'password',
					},
				],
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
			},
		],
	},
	// Required field: Product ID
	{
		displayName: 'Product ID',
		name: 'requiredBody_productId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createActivations'],
				useRawJson: [false],
			},
		},
		description: 'ID of a product that will be activated',
	},
	// Required field: Seat ID
	{
		displayName: 'Seat ID',
		name: 'requiredBody_seatId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createActivations'],
				useRawJson: [false],
			},
		},
		description:
			'Identifier that will identify the computer or account for which activation will be created',
	},
	// Required field: Activation ID
	{
		displayName: 'Activation ID',
		name: 'requiredBody_activationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateActivations'],
				useRawJson: [false],
			},
		},
		description: 'ID of a seat activation that will be refreshed',
	},
	// Required field: Amount
	{
		displayName: 'Amount',
		name: 'requiredBody_amount',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateActivationsFeaturesCheckout'],
				useRawJson: [false],
			},
		},
		description: 'Amount to checkout',
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
				resource: ['entitlement'],
				operation: ['updateActivationsFeaturesCheckout'],
				useRawJson: [false],
			},
		},
		description: 'Feature key',
	},
	// Required field: Amount
	{
		displayName: 'Amount',
		name: 'requiredBody_amount',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateActivationsFeaturesReturn'],
				useRawJson: [false],
			},
		},
		description: 'Amount of feature to return',
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
				resource: ['entitlement'],
				operation: ['updateActivationsFeaturesReturn'],
				useRawJson: [false],
			},
		},
		description: 'Feature key',
	},
	// Required field: Skus
	{
		displayName: 'Skus',
		name: 'requiredBody_skus',
		type: 'fixedCollection',
		required: true,
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createGroups'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Field',
				name: 'entries',
				values: [
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Array item value',
					},
				],
			},
		],
		description: 'Array of SKUs to create an entitlement group for',
	},
	// Required field: Activation Codes
	{
		displayName: 'Activation Codes',
		name: 'requiredBody_activationCodes',
		type: 'fixedCollection',
		required: true,
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateGroupsActivationCodesAdd'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Field',
				name: 'entries',
				values: [
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Array item value',
					},
				],
			},
		],
	},
	// Required field: Count
	{
		displayName: 'Count',
		name: 'requiredBody_count',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateGroupsActivationCodesGenerate'],
				useRawJson: [false],
			},
		},
		description: 'Number of activation codes to generate',
	},
	// Required field: Activation Codes
	{
		displayName: 'Activation Codes',
		name: 'requiredBody_activationCodes',
		type: 'fixedCollection',
		required: true,
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateGroupsActivationCodesRemove'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Field',
				name: 'entries',
				values: [
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Array item value',
					},
				],
			},
		],
	},
	// Required field: ID
	{
		displayName: 'ID',
		name: 'requiredBody_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createGroupsAuthorizedContacts'],
				useRawJson: [false],
			},
		},
		description: 'Customer contact identifier',
	},
	// Required field: Skus
	{
		displayName: 'Skus',
		name: 'requiredBody_skus',
		type: 'fixedCollection',
		required: true,
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createGroupsExtend'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Field',
				name: 'entries',
				values: [
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Array item value',
					},
				],
			},
		],
		description: 'Array of SKUs to add to the entitlement group',
	},
	// Required field: Activation Code
	{
		displayName: 'Activation Code',
		name: 'requiredBody_activationCode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createGroupsFind'],
				useRawJson: [false],
			},
		},
		description: 'Activation code assigned to the entitlement group',
	},
	// Required field: Product ID
	{
		displayName: 'Product ID',
		name: 'requiredBody_productId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createGroupsFind'],
				useRawJson: [false],
			},
		},
		description: 'Product identifier associated with the entitlement group',
	},
	// Optional request body fields for Update entitlement
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['update'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Attributes',
				name: 'attributes',
				type: 'json',
				default: '{}',
				description: 'Array of attributes to update',
			},
			{
				displayName: 'Expiry Date',
				name: 'expiryDate',
				type: 'string',
				default: '',
				description: 'Entitlement expiration date',
			},
			{
				displayName: 'Features',
				name: 'features',
				type: 'json',
				default: '{}',
				description: 'Array of features to update',
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
				displayName: 'Maintenance Expiry Date',
				name: 'maintenanceExpiryDate',
				type: 'string',
				default: '',
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
				displayName: 'Seat Count',
				name: 'seatCount',
				type: 'number',
				default: 0,
				description: 'Number of seats',
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
	// Optional request body fields for Reset entitlement overrides
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateResetOverrides'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Reset Attributes',
				name: 'resetAttributes',
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
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Array item value',
							},
						],
					},
				],
				description: 'Reset attributes from array',
			},
			{
				displayName: 'Reset Features',
				name: 'resetFeatures',
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
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Array item value',
							},
						],
					},
				],
				description: 'Reset features from array',
			},
			{
				displayName: 'Reset Grace Period',
				name: 'resetGracePeriod',
				type: 'boolean',
				default: false,
				description: 'Whether reset grace period',
			},
			{
				displayName: 'Reset Lease Period',
				name: 'resetLeasePeriod',
				type: 'boolean',
				default: false,
				description: 'Whether reset lease period',
			},
			{
				displayName: 'Reset Offline Lease Period',
				name: 'resetOfflineLeasePeriod',
				type: 'boolean',
				default: false,
				description: 'Whether reset offline lease period',
			},
			{
				displayName: 'Reset Overdraft Seat Limit',
				name: 'resetOverdraftSeatLimit',
				type: 'boolean',
				default: false,
				description: 'Whether reset overdraft seat limit',
			},
			{
				displayName: 'Reset Seat Count',
				name: 'resetSeatCount',
				type: 'boolean',
				default: false,
				description: 'Whether reset seat count',
			},
			{
				displayName: 'Reset Usage Reset Schedule',
				name: 'resetUsageResetSchedule',
				type: 'boolean',
				default: false,
				description: 'Whether reset usage reset schedule',
			},
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Create activation
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createActivations'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Edition ID',
				name: 'editionId',
				type: 'string',
				default: '',
				description: 'Edition ID for activation (optional)',
			},
			{
				displayName: 'Seat Name',
				name: 'seatName',
				type: 'string',
				default: '',
				description: 'Optional name of a seat for the activation',
			},
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Create an entitlement group
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['createGroups'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Activation Code',
				name: 'activationCode',
				type: 'string',
				default: '',
				description: 'Optional activation code',
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				description: 'Optional customer ID',
			},
			{
				displayName: 'Order Ref ID',
				name: 'orderRefId',
				type: 'string',
				default: '',
				description: 'Optional order reference number',
			},
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Update entitlement group
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateGroups'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				description: 'Customer identifier',
			},
			{
				displayName: 'Order Ref ID',
				name: 'orderRefId',
				type: 'string',
				default: '',
				description: 'Order reference number',
			},
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Add activation codes
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateGroupsActivationCodesAdd'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Ignore Duplicates',
				name: 'ignoreDuplicates',
				type: 'boolean',
				default: false,
				description:
					'Whether duplicates will be ignored, otherwise duplicate code will return error',
			},
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Remove activation codes
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['entitlement'],
				operation: ['updateGroupsActivationCodesRemove'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Ignore Missing',
				name: 'ignoreMissing',
				type: 'boolean',
				default: false,
				description:
					'Whether missing codes will be ignored, otherwise not found error will be returned',
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
				resource: ['entitlement'],
				operation: [
					'update',
					'updateChangeOffering',
					'createNotes',
					'updateResetOverrides',
					'createActivations',
					'updateActivations',
					'updateActivationsFeaturesCheckout',
					'updateActivationsFeaturesReturn',
					'createGroups',
					'updateGroups',
					'updateGroupsActivationCodesAdd',
					'updateGroupsActivationCodesGenerate',
					'updateGroupsActivationCodesRemove',
					'createGroupsAuthorizedContacts',
					'createGroupsExtend',
					'createGroupsFind',
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
				resource: ['entitlement'],
				operation: [
					'update',
					'updateChangeOffering',
					'createNotes',
					'updateResetOverrides',
					'createActivations',
					'updateActivations',
					'updateActivationsFeaturesCheckout',
					'updateActivationsFeaturesReturn',
					'createGroups',
					'updateGroups',
					'updateGroupsActivationCodesAdd',
					'updateGroupsActivationCodesGenerate',
					'updateGroupsActivationCodesRemove',
					'createGroupsAuthorizedContacts',
					'createGroupsExtend',
					'createGroupsFind',
				],
				useRawJson: [true],
			},
		},
		description: 'Request body data as JSON object',
	},
];
