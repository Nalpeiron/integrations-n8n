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
				name: 'Create Customer',
				value: 'create',
				description: 'Creates new customer',
				action: 'Create customer',
			},
			{
				name: 'Create Customer Contact',
				value: 'createContacts',
				description:
					'This method creates a new customer contact. The contact must have a unique email address for the customer.',
				action: 'Create customer contact',
			},
			{
				name: 'Create Customer Note',
				value: 'createNotes',
				description: 'Creates new customer note',
				action: 'Create customer note',
			},
			{
				name: 'Disable Customer',
				value: 'updateDisable',
				description: "This method disables customer and it's entitlements",
				action: 'Disable customer',
			},
			{
				name: 'Enable Customer',
				value: 'updateEnable',
				description: "This method re-enables customer and it's entitlements",
				action: 'Enable customer',
			},
			{
				name: 'Get a Customer Contact List',
				value: 'listContacts',
				description: 'This method returns a list of customer contacts',
				action: 'Get a customer contact list',
			},
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
				description: 'This method returns the selected customer',
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
			{
				name: 'Request Password Action',
				value: 'createContactsCredentialsPasswordAction',
				description:
					'This method allows to request setup password or reset password for selected contact. If the contact does not have credentials set up, the action will return an error. If the action is "setup", the contact will receive an email with a link t...',
				action: 'Request password action',
			},
			{
				name: 'Search Contacts',
				value: 'listContactsSearch',
				description:
					'This method search for customer contacts by email and returns paginated list of matching contacts',
				action: 'Search contacts',
			},
			{
				name: 'Update Contact Credentials',
				value: 'updateContactsCredentials',
				description:
					"Creates or updates credentials for a contact. Two types of authentication are supported: password and OpenID. When using OpenID authentication, the unique claim value is required. When using password, email will be sent to the contact's em...",
				action: 'Update contact credentials',
			},
			{
				name: 'Update Customer Contact',
				value: 'updateContacts',
				description:
					'This method updates the selected customer contact details. At least one property must be provided.',
				action: 'Update customer contact',
			},
		],
		default: 'create',
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
					'createContacts',
					'listContacts',
					'getContacts',
					'updateContacts',
					'listContactsCredentials',
					'updateContactsCredentials',
					'createContactsCredentialsPasswordAction',
					'updateDisable',
					'updateEnable',
					'listEup',
					'createNotes',
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
				operation: [
					'getContacts',
					'updateContacts',
					'listContactsCredentials',
					'updateContactsCredentials',
					'createContactsCredentialsPasswordAction',
				],
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
	// Required field: Name
	{
		displayName: 'Name',
		name: 'requiredBody_name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		description: 'Customer name',
	},
	// Required field: Email
	{
		displayName: 'Email',
		name: 'requiredBody_email',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['createContacts'],
				useRawJson: [false],
			},
		},
		description: 'Contact email',
	},
	// Required field: Authentication
	{
		displayName: 'Authentication',
		name: 'requiredBody_authentication',
		type: 'collection',
		required: true,
		default: { type: 'password' },
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['updateContactsCredentials'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Claim Value',
				name: 'claimValue',
				type: 'string',
				default: '',
				description: 'Value from OpenId token that identifies user',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'password',
				options: [
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
		],
	},
	// Required field: Role
	{
		displayName: 'Role',
		name: 'requiredBody_role',
		type: 'options',
		required: true,
		default: 'user',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['updateContactsCredentials'],
				useRawJson: [false],
			},
		},
		options: [
			{
				name: 'Admin',
				value: 'admin',
			},
			{
				name: 'User',
				value: 'user',
			},
		],
	},
	// Required field: Action
	{
		displayName: 'Action',
		name: 'requiredBody_action',
		type: 'options',
		required: true,
		default: 'setup',
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['createContactsCredentialsPasswordAction'],
				useRawJson: [false],
			},
		},
		options: [
			{
				name: 'Reset',
				value: 'reset',
			},
			{
				name: 'Setup',
				value: 'setup',
			},
		],
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
				resource: ['customer'],
				operation: ['createNotes'],
				useRawJson: [false],
			},
		},
		description: 'Customer note',
	},
	// Optional request body fields for Create customer
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['create'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Account Ref ID',
				name: 'accountRefId',
				type: 'string',
				default: '',
				description: 'Account reference ID',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Address Line1',
						name: 'addressLine1',
						type: 'string',
						default: '',
						description: 'Address line 1',
					},
					{
						displayName: 'Address Line2',
						name: 'addressLine2',
						type: 'string',
						default: '',
						description: 'Address line 2',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Country code (ISO 3166-1 alpha-2)',
					},
					{
						displayName: 'Postal Code',
						name: 'postalCode',
						type: 'string',
						default: '',
					},
					{
						displayName: 'State Region',
						name: 'stateRegion',
						type: 'string',
						default: '',
						description: 'State or region',
					},
				],
			},
			{
				displayName: 'Contract Renewal Date',
				name: 'contractRenewalDate',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Contract Start Date',
				name: 'contractStartDate',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Contract Value',
				name: 'contractValue',
				type: 'number',
				default: 0,
				description: 'Contract value in USD',
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
				description: 'Customer description',
			},
			{
				displayName: 'Legal Name',
				name: 'legalName',
				type: 'string',
				default: '',
				description: 'Customer legal name',
			},
			{
				displayName: 'Linked In URL',
				name: 'linkedInUrl',
				type: 'string',
				default: '',
				description: 'Customer LinkedIn URL',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'active',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Disabled',
						value: 'disabled',
					},
					{
						name: 'Inactive',
						value: 'inactive',
					},
				],
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'customer',
				options: [
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Lost Customer',
						value: 'lostCustomer',
					},
					{
						name: 'Lost Prospect',
						value: 'lostProspect',
					},
					{
						name: 'Prospect',
						value: 'prospect',
					},
					{
						name: 'Remove',
						value: 'remove',
					},
				],
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'Customer website URL',
			},
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Create customer contact
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['createContacts'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Contact Ref ID',
				name: 'contactRefId',
				type: 'string',
				default: '',
				description: 'Contact reference identifier',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'Contact first name',
			},
			{
				displayName: 'Is Key Contact',
				name: 'isKeyContact',
				type: 'boolean',
				default: false,
				description: 'Whether indicates if the contact is a key contact',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Contact last name',
			},
			{
				displayName: 'Linked In Profile',
				name: 'linkedInProfile',
				type: 'string',
				default: '',
				description: "Contact's LinkedIn profile URL",
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				description: "Contact's phone number in E.164 format",
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'active',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Inactive',
						value: 'inactive',
					},
				],
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Contact job title',
			},
		],
		description: 'Optional request body fields',
	},
	// Optional request body fields for Update customer contact
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['customer'],
				operation: ['updateContacts'],
				useRawJson: [false],
			},
		},
		options: [
			{
				displayName: 'Contact Ref ID',
				name: 'contactRefId',
				type: 'string',
				default: '',
				description: 'Contact reference identifier',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Contact email',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'Contact first name',
			},
			{
				displayName: 'Is Key Contact',
				name: 'isKeyContact',
				type: 'boolean',
				default: false,
				description: 'Whether indicates if the contact is a key contact',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Contact last name',
			},
			{
				displayName: 'Linked In Profile',
				name: 'linkedInProfile',
				type: 'string',
				default: '',
				description: "Contact's LinkedIn profile URL",
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Country Code',
						name: 'countryCode',
						type: 'string',
						default: '',
						description: '2-character ISO country code (US, CA, etc.)',
					},
					{
						displayName: 'Region Code',
						name: 'regionCode',
						type: 'string',
						default: '',
						description: '2-character region/state code (NY, CA, etc.)',
					},
				],
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				description: "Contact's phone number in E.164 format",
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'active',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Inactive',
						value: 'inactive',
					},
				],
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Contact job title',
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
				resource: ['customer'],
				operation: [
					'create',
					'createContacts',
					'updateContacts',
					'updateContactsCredentials',
					'createContactsCredentialsPasswordAction',
					'createNotes',
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
				resource: ['customer'],
				operation: [
					'create',
					'createContacts',
					'updateContacts',
					'updateContactsCredentials',
					'createContactsCredentialsPasswordAction',
					'createNotes',
				],
				useRawJson: [true],
			},
		},
		description: 'Request body data as JSON object',
	},
];
