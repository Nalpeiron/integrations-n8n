import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../base-resource-handler';
import { makeAuthenticatedRequest, type INalpeironCredentials } from '../../utils';

export class CustomerResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		resource: string,
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
			case 'listEup':
				return this.listEup(executeFunctions, credentials, accessToken, itemIndex);
			case 'listNotes':
				return this.listNotes(executeFunctions, credentials, accessToken, itemIndex);
			case 'getNotes':
				return this.getNotes(executeFunctions, credentials, accessToken, itemIndex);
			case 'listUsers':
				return this.listUsers(executeFunctions, credentials, accessToken, itemIndex);
			case 'getUsers':
				return this.getUsers(executeFunctions, credentials, accessToken, itemIndex);
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

	private async listUsers(
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
			`/api/v1/customers/${customerId}/users`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async getUsers(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const userId = this.getNodeParameter(executeFunctions, 'userId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/customers/${customerId}/users/${userId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}
}
