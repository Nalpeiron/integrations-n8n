import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest, type INalpeironCredentials } from '../../../shared/utils';

export class PlanResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'list':
				return this.listPlans(executeFunctions, credentials, accessToken, itemIndex);
			case 'get':
				return this.getPlan(executeFunctions, credentials, accessToken, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async listPlans(
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
			`/api/v1/plans`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async getPlan(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const planId = this.getNodeParameter(executeFunctions, 'planId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/plans/${planId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}
}
