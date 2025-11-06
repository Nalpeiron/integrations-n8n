import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest } from '../../../shared/utils';

export class PlanResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'list':
				return this.listPlans(executeFunctions, itemIndex);
			case 'get':
				return this.getPlan(executeFunctions, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async listPlans(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/plans`,
			undefined,
			additionalFields,
		);
	}

	private async getPlan(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const planId = this.getNodeParameter(executeFunctions, 'planId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/plans/${planId}`,
			undefined,
		);
	}
}
