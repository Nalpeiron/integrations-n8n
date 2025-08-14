import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest, type INalpeironCredentials } from '../../../shared/utils';

export class EntitlementResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'list':
				return this.listEntitlements(executeFunctions, credentials, accessToken, itemIndex);
			case 'get':
				return this.getEntitlement(executeFunctions, credentials, accessToken, itemIndex);
			case 'listActivations':
				return this.listActivations(executeFunctions, credentials, accessToken, itemIndex);
			case 'listActivationsLog':
				return this.listActivationsLog(executeFunctions, credentials, accessToken, itemIndex);
			case 'listNotes':
				return this.listNotes(executeFunctions, credentials, accessToken, itemIndex);
			case 'getNotes':
				return this.getNotes(executeFunctions, credentials, accessToken, itemIndex);
			case 'getActivations':
				return this.getActivations(executeFunctions, credentials, accessToken, itemIndex);
			case 'listGroups':
				return this.listGroups(executeFunctions, credentials, accessToken, itemIndex);
			case 'getGroups':
				return this.getGroups(executeFunctions, credentials, accessToken, itemIndex);
			case 'listGroupsAuthorizedContacts':
				return this.listGroupsAuthorizedContacts(
					executeFunctions,
					credentials,
					accessToken,
					itemIndex,
				);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async listEntitlements(
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
			`/api/v1/entitlements`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async getEntitlement(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
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
			'GET',
			`/api/v1/entitlements/${entitlementId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async listActivations(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
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
			'GET',
			`/api/v1/entitlements/${entitlementId}/activations`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async listActivationsLog(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
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
			'GET',
			`/api/v1/entitlements/${entitlementId}/activations-log`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async listNotes(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/entitlements/${entitlementId}/notes`,
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
		const entitlementId = this.getNodeParameter(
			executeFunctions,
			'entitlementId',
			itemIndex,
		) as string;
		const noteId = this.getNodeParameter(executeFunctions, 'noteId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/entitlements/${entitlementId}/notes/${noteId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async getActivations(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const activationId = this.getNodeParameter(
			executeFunctions,
			'activationId',
			itemIndex,
		) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/entitlements/activations/${activationId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listGroups(
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
			`/api/v1/entitlements/groups`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async getGroups(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
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
			'GET',
			`/api/v1/entitlements/groups/${entitlementGroupId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async listGroupsAuthorizedContacts(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
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
			'GET',
			`/api/v1/entitlements/groups/${entitlementGroupId}/authorized-contacts`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}
}
