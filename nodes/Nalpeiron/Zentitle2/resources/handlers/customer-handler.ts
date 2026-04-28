import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest } from '../../../shared/utils';

export class CustomerResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<unknown> {
		switch (operation) {
			case 'create':
				return this.createCustomer(executeFunctions, itemIndex);
			case 'list':
				return this.listCustomers(executeFunctions, itemIndex);
			case 'get':
				return this.getCustomer(executeFunctions, itemIndex);
			case 'createContacts':
				return this.createContacts(executeFunctions, itemIndex);
			case 'listContacts':
				return this.listContacts(executeFunctions, itemIndex);
			case 'getContacts':
				return this.getContacts(executeFunctions, itemIndex);
			case 'updateContacts':
				return this.updateContacts(executeFunctions, itemIndex);
			case 'listContactsCredentials':
				return this.listContactsCredentials(executeFunctions, itemIndex);
			case 'updateContactsCredentials':
				return this.updateContactsCredentials(executeFunctions, itemIndex);
			case 'createContactsCredentialsPasswordAction':
				return this.createContactsCredentialsPasswordAction(executeFunctions, itemIndex);
			case 'updateDisable':
				return this.updateDisable(executeFunctions, itemIndex);
			case 'updateEnable':
				return this.updateEnable(executeFunctions, itemIndex);
			case 'listEup':
				return this.listEup(executeFunctions, itemIndex);
			case 'createNotes':
				return this.createNotes(executeFunctions, itemIndex);
			case 'listNotes':
				return this.listNotes(executeFunctions, itemIndex);
			case 'getNotes':
				return this.getNotes(executeFunctions, itemIndex);
			case 'listStats':
				return this.listStats(executeFunctions, itemIndex);
			case 'listContactsSearch':
				return this.listContactsSearch(executeFunctions, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async createCustomer(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
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

			const requiredBody_nameValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_name',
				itemIndex,
			) as string;
			bodyFromFields['name'] = requiredBody_nameValue;

			const requestBodyAdditionalFields = this.getNodeParameter(
				executeFunctions,
				'additionalFields',
				itemIndex,
				{},
			) as IDataObject;
			Object.assign(bodyFromFields, requestBodyAdditionalFields);
			if (requestBodyAdditionalFields['customFields']) {
				bodyFromFields['customFields'] = this.convertFixedCollectionToObject(
					requestBodyAdditionalFields['customFields'] as IDataObject,
				);
			}

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'POST',
			`/api/v1/customers`,
			finalRequestBody,
		);
	}

	private async listCustomers(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers`,
			undefined,
			additionalFields,
		);
	}

	private async getCustomer(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}`,
			undefined,
		);
	}

	private async createContacts(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

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

			const requiredBody_emailValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_email',
				itemIndex,
			) as string;
			bodyFromFields['email'] = requiredBody_emailValue;

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
			`/api/v1/customers/${customerId}/contacts`,
			finalRequestBody,
		);
	}

	private async listContacts(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/contacts`,
			undefined,
			additionalFields,
		);
	}

	private async getContacts(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const contactId = this.getNodeParameter(executeFunctions, 'contactId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/contacts/${contactId}`,
			undefined,
		);
	}

	private async updateContacts(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const contactId = this.getNodeParameter(executeFunctions, 'contactId', itemIndex) as string;

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
			`/api/v1/customers/${customerId}/contacts/${contactId}`,
			finalRequestBody,
		);
	}

	private async listContactsCredentials(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const contactId = this.getNodeParameter(executeFunctions, 'contactId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/contacts/${contactId}/credentials`,
			undefined,
		);
	}

	private async updateContactsCredentials(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const contactId = this.getNodeParameter(executeFunctions, 'contactId', itemIndex) as string;

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

			const requiredBody_authenticationValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_authentication',
				itemIndex,
			) as IDataObject;
			bodyFromFields['authentication'] = this.applySchemaDefaultsToObject(
				requiredBody_authenticationValue,
				{
					type: 'object',
					discriminator: {
						propertyName: 'type',
						mapping: {
							password: '#/components/schemas/PasswordAuthenticationModel',
							openIdToken: '#/components/schemas/OpenIdAuthenticationModel',
						},
					},
					required: ['type'],
					properties: {
						type: { type: 'string', description: '', enum: ['password', 'openIdToken'] },
						claimValue: {
							type: 'string',
							description: 'Value from OpenId token that identifies user',
							maxLength: 100,
							minLength: 1,
							example: 'john.doe@example.com',
						},
					},
				} as IDataObject,
			);
			const requiredBody_roleValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_role',
				itemIndex,
			) as string;
			bodyFromFields['role'] = requiredBody_roleValue;

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/customers/${customerId}/contacts/${contactId}/credentials`,
			finalRequestBody,
		);
	}

	private async createContactsCredentialsPasswordAction(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const contactId = this.getNodeParameter(executeFunctions, 'contactId', itemIndex) as string;

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

			const requiredBody_actionValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_action',
				itemIndex,
			) as string;
			bodyFromFields['action'] = requiredBody_actionValue;

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'POST',
			`/api/v1/customers/${customerId}/contacts/${contactId}/credentials/password/action`,
			finalRequestBody,
		);
	}

	private async updateDisable(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/customers/${customerId}/disable`,
			undefined,
		);
	}

	private async updateEnable(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/customers/${customerId}/enable`,
			undefined,
		);
	}

	private async listEup(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/eup`,
			undefined,
		);
	}

	private async createNotes(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

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
			`/api/v1/customers/${customerId}/notes`,
			finalRequestBody,
		);
	}

	private async listNotes(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/notes`,
			undefined,
		);
	}

	private async getNotes(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const noteId = this.getNodeParameter(executeFunctions, 'noteId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/notes/${noteId}`,
			undefined,
		);
	}

	private async listStats(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/stats`,
			undefined,
		);
	}

	private async listContactsSearch(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/contacts/search`,
			undefined,
			additionalFields,
		);
	}
}
