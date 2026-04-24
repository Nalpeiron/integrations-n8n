import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest } from '../../../shared/utils';

export class EntitlementResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'list':
				return this.listEntitlements(executeFunctions, itemIndex);
			case 'get':
				return this.getEntitlement(executeFunctions, itemIndex);
			case 'update':
				return this.updateEntitlement(executeFunctions, itemIndex);
			case 'updateActivate':
				return this.updateActivate(executeFunctions, itemIndex);
			case 'listActivations':
				return this.listActivations(executeFunctions, itemIndex);
			case 'listActivationsLog':
				return this.listActivationsLog(executeFunctions, itemIndex);
			case 'updateChangeOffering':
				return this.updateChangeOffering(executeFunctions, itemIndex);
			case 'updateDisable':
				return this.updateDisable(executeFunctions, itemIndex);
			case 'updateEnable':
				return this.updateEnable(executeFunctions, itemIndex);
			case 'updateFeatureReset':
				return this.updateFeatureReset(executeFunctions, itemIndex);
			case 'createNotes':
				return this.createNotes(executeFunctions, itemIndex);
			case 'listNotes':
				return this.listNotes(executeFunctions, itemIndex);
			case 'getNotes':
				return this.getNotes(executeFunctions, itemIndex);
			case 'createProvision':
				return this.createProvision(executeFunctions, itemIndex);
			case 'updateRenew':
				return this.updateRenew(executeFunctions, itemIndex);
			case 'updateResetOverrides':
				return this.updateResetOverrides(executeFunctions, itemIndex);
			case 'createActivations':
				return this.createActivations(executeFunctions, itemIndex);
			case 'updateActivations':
				return this.updateActivations(executeFunctions, itemIndex);
			case 'getActivations':
				return this.getActivations(executeFunctions, itemIndex);
			case 'updateActivationsFeaturesCheckout':
				return this.updateActivationsFeaturesCheckout(executeFunctions, itemIndex);
			case 'updateActivationsFeaturesReturn':
				return this.updateActivationsFeaturesReturn(executeFunctions, itemIndex);
			case 'createGroups':
				return this.createGroups(executeFunctions, itemIndex);
			case 'listGroups':
				return this.listGroups(executeFunctions, itemIndex);
			case 'getGroups':
				return this.getGroups(executeFunctions, itemIndex);
			case 'updateGroups':
				return this.updateGroups(executeFunctions, itemIndex);
			case 'updateGroupsActivationCodesAdd':
				return this.updateGroupsActivationCodesAdd(executeFunctions, itemIndex);
			case 'updateGroupsActivationCodesGenerate':
				return this.updateGroupsActivationCodesGenerate(executeFunctions, itemIndex);
			case 'updateGroupsActivationCodesRemove':
				return this.updateGroupsActivationCodesRemove(executeFunctions, itemIndex);
			case 'createGroupsAuthorizedContacts':
				return this.createGroupsAuthorizedContacts(executeFunctions, itemIndex);
			case 'listGroupsAuthorizedContacts':
				return this.listGroupsAuthorizedContacts(executeFunctions, itemIndex);
			case 'createGroupsExtend':
				return this.createGroupsExtend(executeFunctions, itemIndex);
			case 'createGroupsFind':
				return this.createGroupsFind(executeFunctions, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async listEntitlements(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/entitlements`,
			undefined,
			additionalFields,
		);
	}

	private async getEntitlement(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/entitlements/${entitlementId}`,
			undefined,
			additionalFields,
		);
	}

	private async updateEntitlement(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requestBodyAdditionalFields = this.getNodeParameter(
				executeFunctions,
				'additionalFields',
				itemIndex,
				{},
			) as IDataObject;
			Object.assign(bodyFromFields, requestBodyAdditionalFields);

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/${entitlementId}`,
			finalRequestBody,
			additionalFields,
		);
	}

	private async updateActivate(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/${entitlementId}/activate`,
			undefined,
		);
	}

	private async listActivations(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/entitlements/${entitlementId}/activations`,
			undefined,
			additionalFields,
		);
	}

	private async listActivationsLog(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/entitlements/${entitlementId}/activations-log`,
			undefined,
			additionalFields,
		);
	}

	private async updateChangeOffering(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_offeringIdValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_offeringId',
				itemIndex,
			) as string;
			bodyFromFields['offeringId'] = requiredBody_offeringIdValue;

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/${entitlementId}/change-offering`,
			finalRequestBody,
			additionalFields,
		);
	}

	private async updateDisable(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/${entitlementId}/disable`,
			undefined,
		);
	}

	private async updateEnable(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/${entitlementId}/enable`,
			undefined,
		);
	}

	private async updateFeatureReset(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;
		const featureId = this.getNodeParameter(executeFunctions, 'featureId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/${entitlementId}/feature/${featureId}/reset`,
			undefined,
		);
	}

	private async createNotes(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_noteValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_note',
				itemIndex,
			) as string;
			bodyFromFields['note'] = requiredBody_noteValue;

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'POST',
			`/api/v1/entitlements/${entitlementId}/notes`,
			finalRequestBody,
		);
	}

	private async listNotes(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/entitlements/${entitlementId}/notes`,
			undefined,
		);
	}

	private async getNotes(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;
		const noteId = this.getNodeParameter(executeFunctions, 'noteId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/entitlements/${entitlementId}/notes/${noteId}`,
			undefined,
		);
	}

	private async createProvision(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'POST',
			`/api/v1/entitlements/${entitlementId}/provision`,
			undefined,
		);
	}

	private async updateRenew(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/${entitlementId}/renew`,
			undefined,
		);
	}

	private async updateResetOverrides(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requestBodyAdditionalFields = this.getNodeParameter(
				executeFunctions,
				'additionalFields',
				itemIndex,
				{},
			) as IDataObject;
			Object.assign(bodyFromFields, requestBodyAdditionalFields);
			if (requestBodyAdditionalFields['resetFeatures']) {
				bodyFromFields['resetFeatures'] = this.convertFixedCollectionToArray(
					requestBodyAdditionalFields['resetFeatures'] as IDataObject,
				);
			}
			if (requestBodyAdditionalFields['resetAttributes']) {
				bodyFromFields['resetAttributes'] = this.convertFixedCollectionToArray(
					requestBodyAdditionalFields['resetAttributes'] as IDataObject,
				);
			}

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/${entitlementId}/reset-overrides`,
			finalRequestBody,
			additionalFields,
		);
	}

	private async createActivations(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_productIdValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_productId',
				itemIndex,
			) as string;
			bodyFromFields['productId'] = requiredBody_productIdValue;
			const requiredBody_activationCredentialsValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_activationCredentials',
				itemIndex,
			) as IDataObject;
			bodyFromFields['activationCredentials'] = this.applySchemaDefaultsToObject(
				requiredBody_activationCredentialsValue,
				{
					type: 'object',
					discriminator: {
						propertyName: 'type',
						mapping: {
							activationCode: '#/components/schemas/ActivationCodeCredentialsModel',
							openIdToken: '#/components/schemas/OpenIdTokenCredentialsModel',
							password: '#/components/schemas/PasswordCredentialsModel',
						},
					},
					required: ['type'],
					properties: {
						type: {
							type: 'string',
							description: '',
							enum: ['activationCode', 'openIdToken', 'password'],
						},
						code: {
							type: 'string',
							description: 'Activation code',
							maxLength: 50,
							minLength: 1,
							example: 1234567890,
						},
						token: {
							type: 'string',
							description: 'OpenID JWT token',
							minLength: 1,
							example:
								'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
						},
						username: {
							type: 'string',
							description: 'Username',
							format: 'email',
							minLength: 1,
							example: 'john.doe@example.com',
						},
						password: {
							type: 'string',
							description: 'Password',
							minLength: 1,
							example: 'password',
						},
					},
				} as IDataObject,
			);
			const requiredBody_seatIdValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_seatId',
				itemIndex,
			) as string;
			bodyFromFields['seatId'] = requiredBody_seatIdValue;

			const requestBodyAdditionalFields = this.getNodeParameter(
				executeFunctions,
				'additionalFields',
				itemIndex,
				{},
			) as IDataObject;
			Object.assign(bodyFromFields, requestBodyAdditionalFields);

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'POST',
			`/api/v1/entitlements/activations`,
			finalRequestBody,
		);
	}

	private async updateActivations(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_activationIdValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_activationId',
				itemIndex,
			) as string;
			bodyFromFields['activationId'] = requiredBody_activationIdValue;

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/activations`,
			finalRequestBody,
		);
	}

	private async getActivations(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const activationId = this.getNodeParameter(
			executeFunctions,
			'activationId',
			itemIndex,
		) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/entitlements/activations/${activationId}`,
			undefined,
		);
	}

	private async updateActivationsFeaturesCheckout(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const activationId = this.getNodeParameter(
			executeFunctions,
			'activationId',
			itemIndex,
		) as string;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_keyValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_key',
				itemIndex,
			) as string;
			bodyFromFields['key'] = requiredBody_keyValue;
			const requiredBody_amountValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_amount',
				itemIndex,
			) as number;
			bodyFromFields['amount'] = requiredBody_amountValue;

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/activations/${activationId}/features/checkout`,
			finalRequestBody,
		);
	}

	private async updateActivationsFeaturesReturn(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const activationId = this.getNodeParameter(
			executeFunctions,
			'activationId',
			itemIndex,
		) as string;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_keyValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_key',
				itemIndex,
			) as string;
			bodyFromFields['key'] = requiredBody_keyValue;
			const requiredBody_amountValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_amount',
				itemIndex,
			) as number;
			bodyFromFields['amount'] = requiredBody_amountValue;

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/activations/${activationId}/features/return`,
			finalRequestBody,
		);
	}

	private async createGroups(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_skusValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_skus',
				itemIndex,
			) as IDataObject;
			bodyFromFields['skus'] = this.convertFixedCollectionToArray(requiredBody_skusValue);

			const requestBodyAdditionalFields = this.getNodeParameter(
				executeFunctions,
				'additionalFields',
				itemIndex,
				{},
			) as IDataObject;
			Object.assign(bodyFromFields, requestBodyAdditionalFields);

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'POST',
			`/api/v1/entitlements/groups`,
			finalRequestBody,
		);
	}

	private async listGroups(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/entitlements/groups`,
			undefined,
			additionalFields,
		);
	}

	private async getGroups(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const entitlementGroupId = this.getNodeParameter(
			executeFunctions,
			'entitlementGroupId',
			itemIndex,
		) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/entitlements/groups/${entitlementGroupId}`,
			undefined,
			additionalFields,
		);
	}

	private async updateGroups(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const entitlementGroupId = this.getNodeParameter(
			executeFunctions,
			'entitlementGroupId',
			itemIndex,
		) as string;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requestBodyAdditionalFields = this.getNodeParameter(
				executeFunctions,
				'additionalFields',
				itemIndex,
				{},
			) as IDataObject;
			Object.assign(bodyFromFields, requestBodyAdditionalFields);

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/groups/${entitlementGroupId}`,
			finalRequestBody,
		);
	}

	private async updateGroupsActivationCodesAdd(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementGroupId = this.getNodeParameter(
			executeFunctions,
			'entitlementGroupId',
			itemIndex,
		) as string;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_activationCodesValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_activationCodes',
				itemIndex,
			) as IDataObject;
			bodyFromFields['activationCodes'] = this.convertFixedCollectionToArray(
				requiredBody_activationCodesValue,
			);

			const requestBodyAdditionalFields = this.getNodeParameter(
				executeFunctions,
				'additionalFields',
				itemIndex,
				{},
			) as IDataObject;
			Object.assign(bodyFromFields, requestBodyAdditionalFields);

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/groups/${entitlementGroupId}/activation-codes/add`,
			finalRequestBody,
		);
	}

	private async updateGroupsActivationCodesGenerate(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementGroupId = this.getNodeParameter(
			executeFunctions,
			'entitlementGroupId',
			itemIndex,
		) as string;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_countValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_count',
				itemIndex,
			) as number;
			bodyFromFields['count'] = requiredBody_countValue;

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/groups/${entitlementGroupId}/activation-codes/generate`,
			finalRequestBody,
		);
	}

	private async updateGroupsActivationCodesRemove(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementGroupId = this.getNodeParameter(
			executeFunctions,
			'entitlementGroupId',
			itemIndex,
		) as string;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_activationCodesValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_activationCodes',
				itemIndex,
			) as IDataObject;
			bodyFromFields['activationCodes'] = this.convertFixedCollectionToArray(
				requiredBody_activationCodesValue,
			);

			const requestBodyAdditionalFields = this.getNodeParameter(
				executeFunctions,
				'additionalFields',
				itemIndex,
				{},
			) as IDataObject;
			Object.assign(bodyFromFields, requestBodyAdditionalFields);

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/entitlements/groups/${entitlementGroupId}/activation-codes/remove`,
			finalRequestBody,
		);
	}

	private async createGroupsAuthorizedContacts(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementGroupId = this.getNodeParameter(
			executeFunctions,
			'entitlementGroupId',
			itemIndex,
		) as string;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_idValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_id',
				itemIndex,
			) as string;
			bodyFromFields['id'] = requiredBody_idValue;

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'POST',
			`/api/v1/entitlements/groups/${entitlementGroupId}/authorized-contacts`,
			finalRequestBody,
		);
	}

	private async listGroupsAuthorizedContacts(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementGroupId = this.getNodeParameter(
			executeFunctions,
			'entitlementGroupId',
			itemIndex,
		) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/entitlements/groups/${entitlementGroupId}/authorized-contacts`,
			undefined,
			additionalFields,
		);
	}

	private async createGroupsExtend(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const entitlementGroupId = this.getNodeParameter(
			executeFunctions,
			'entitlementGroupId',
			itemIndex,
		) as string;

		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_skusValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_skus',
				itemIndex,
			) as IDataObject;
			bodyFromFields['skus'] = this.convertFixedCollectionToArray(requiredBody_skusValue);

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'POST',
			`/api/v1/entitlements/groups/${entitlementGroupId}/extend`,
			finalRequestBody,
		);
	}

	private async createGroupsFind(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const useRawJson = this.getNodeParameter(
			executeFunctions,
			'useRawJson',
			itemIndex,
			false,
		) as boolean;

		const nodeParameters = executeFunctions.getNode().parameters as IDataObject;
		const hasPersistedRequestBody = Object.prototype.hasOwnProperty.call(
			nodeParameters,
			'requestBody',
		);

		let finalRequestBody: IDataObject = {};
		if (useRawJson || hasPersistedRequestBody) {
			finalRequestBody = this.getNodeParameter(
				executeFunctions,
				'requestBody',
				itemIndex,
				{},
			) as IDataObject;
		} else {
			const bodyFromFields: IDataObject = {};

			const requiredBody_activationCodeValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_activationCode',
				itemIndex,
			) as string;
			bodyFromFields['activationCode'] = requiredBody_activationCodeValue;
			const requiredBody_productIdValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_productId',
				itemIndex,
			) as string;
			bodyFromFields['productId'] = requiredBody_productIdValue;

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'POST',
			`/api/v1/entitlements/groups/find`,
			finalRequestBody,
		);
	}
}
