import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest } from '../../../shared/utils';

export class CustomerResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'list':
				return this.listCustomers(executeFunctions, itemIndex);
			case 'get':
				return this.getCustomer(executeFunctions, itemIndex);
			case 'listContacts':
				return this.listContacts(executeFunctions, itemIndex);
			case 'getContacts':
				return this.getContacts(executeFunctions, itemIndex);
			case 'listContactsCredentials':
				return this.listContactsCredentials(executeFunctions, itemIndex);
			case 'listEup':
				return this.listEup(executeFunctions, itemIndex);
			case 'listNotes':
				return this.listNotes(executeFunctions, itemIndex);
			case 'getNotes':
				return this.getNotes(executeFunctions, itemIndex);
			case 'listStats':
				return this.listStats(executeFunctions, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async listCustomers(
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
			`/api/v1/customers`,
			undefined,
			additionalFields,
		);
	}

	private async getCustomer(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}`,
			undefined,
		);
	}

	private async listContacts(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
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

	private async getContacts(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const contactId = this.getNodeParameter(executeFunctions, 'contactId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/contacts/${contactId}`,
			undefined,
		);
	}

	private async listContactsCredentials(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const contactId = this.getNodeParameter(executeFunctions, 'contactId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/contacts/${contactId}/credentials`,
			undefined,
		);
	}

	private async listEup(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/eup`,
			undefined,
		);
	}

	private async listNotes(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/notes`,
			undefined,
		);
	}

	private async getNotes(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;
		const noteId = this.getNodeParameter(executeFunctions, 'noteId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/notes/${noteId}`,
			undefined,
		);
	}

	private async listStats(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const customerId = this.getNodeParameter(executeFunctions, 'customerId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/customers/${customerId}/stats`,
			undefined,
		);
	}
}
