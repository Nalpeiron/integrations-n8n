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
			case 'listActivations':
				return this.listActivations(executeFunctions, itemIndex);
			case 'listActivationsLog':
				return this.listActivationsLog(executeFunctions, itemIndex);
			case 'listNotes':
				return this.listNotes(executeFunctions, itemIndex);
			case 'getNotes':
				return this.getNotes(executeFunctions, itemIndex);
			case 'getActivations':
				return this.getActivations(executeFunctions, itemIndex);
			case 'listGroups':
				return this.listGroups(executeFunctions, itemIndex);
			case 'getGroups':
				return this.getGroups(executeFunctions, itemIndex);
			case 'listGroupsAuthorizedContacts':
				return this.listGroupsAuthorizedContacts(executeFunctions, itemIndex);
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
}
