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
				name: 'Get Entitlement',
				value: 'get',
				description: 'This method returns entitlement details',
				action: 'Get entitlement',
			},
			{
				name: 'Get Entitlement Activations',
				value: 'getActivations',
				description:
					'This method returns activation details including information about attributes and available features',
				action: 'Get entitlement activations',
			},
			{
				name: 'Get Entitlement Groups',
				value: 'getGroups',
				description:
					'This method returns entitlement group details. The amount of data returned can be adjusted by using query expand paramet...',
				action: 'Get entitlement groups',
			},
			{
				name: 'Get Entitlement Notes',
				value: 'getNotes',
				description: 'This method returns entitlement note',
				action: 'Get entitlement notes',
			},
			{
				name: 'List Entitlement Activations',
				value: 'listActivations',
				description:
					'This method returns list of entitlement activation that can be filtered by following query parameters',
				action: 'List entitlement activations',
			},
			{
				name: 'List Entitlement Activations Log',
				value: 'listActivationsLog',
				description: 'This method returns log of activations activity on the entitlement',
				action: 'List entitlement activations log',
			},
			{
				name: 'List Entitlement Groups',
				value: 'listGroups',
				description:
					'This method returns entitlement group list. Amount of data returned can be adjusted by using query expand parameter conf...',
				action: 'List entitlement groups',
			},
			{
				name: 'List Entitlement Groups Authorized Contacts',
				value: 'listGroupsAuthorizedContacts',
				description:
					'This method returns list of contacts (with ABL credentials) authorized for the entitlement group',
				action: 'List entitlement groups authorized contacts',
			},
			{
				name: 'List Entitlement Notes',
				value: 'listNotes',
				description: 'This method returns list of entitlement notes',
				action: 'List entitlement notes',
			},
			{
				name: 'List Entitlements',
				value: 'list',
				description:
					'This method returns list of entitlements that can be filtered by following query parameters',
				action: 'List entitlements',
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
				operation: ['get', 'listActivations', 'listActivationsLog', 'listNotes', 'getNotes'],
			},
		},
		default: '',
		description: 'The entitlementId identifier',
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
				operation: ['getActivations'],
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
				operation: ['getGroups', 'listGroupsAuthorizedContacts'],
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
];
