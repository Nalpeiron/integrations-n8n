import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest, type INalpeironCredentials } from '../../../shared/utils';

export class CustomerResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'list':
				return this.listCustomers(executeFunctions, credentials, accessToken, itemIndex);
			case 'get':
				return this.getCustomer(executeFunctions, credentials, accessToken, itemIndex);
			case 'listContacts':
				return this.listContacts(executeFunctions, credentials, accessToken, itemIndex);
			case 'getContacts':
				return this.getContacts(executeFunctions, credentials, accessToken, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async listCustomers(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async getCustomer(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers/${customerId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listContacts(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers/${customerId}/contacts`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async getContacts(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const contactId = this.getNodeParameter(executeFunctions, 'contactId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers/${customerId}/contacts/${contactId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}
}
