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
			case 'getContacts':
				return this.getContacts(executeFunctions, credentials, accessToken, itemIndex);
			case 'listContactsCredentials':
				return this.listContactsCredentials(executeFunctions, credentials, accessToken, itemIndex);
			case 'listEup':
				return this.listEup(executeFunctions, credentials, accessToken, itemIndex);
			case 'listNotes':
				return this.listNotes(executeFunctions, credentials, accessToken, itemIndex);
			case 'getNotes':
				return this.getNotes(executeFunctions, credentials, accessToken, itemIndex);
			case 'listStats':
				return this.listStats(executeFunctions, credentials, accessToken, itemIndex);
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

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers/${customerId}`,
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

	private async listContactsCredentials(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const contactId = this.getNodeParameter(executeFunctions, 'contactId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers/${customerId}/contacts/${contactId}/credentials`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listEup(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers/${customerId}/eup`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listNotes(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers/${customerId}/notes`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async getNotes(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const noteId = this.getNodeParameter(executeFunctions, 'noteId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers/${customerId}/notes/${noteId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listStats(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers/${customerId}/stats`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}
}
