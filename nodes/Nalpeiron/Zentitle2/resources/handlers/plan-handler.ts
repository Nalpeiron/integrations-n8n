import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest } from '../../../shared/utils';

export class PlanResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<unknown> {
		switch (operation) {
			case 'create':
				return this.createPlan(executeFunctions, itemIndex);
			case 'list':
				return this.listPlans(executeFunctions, itemIndex);
			case 'get':
				return this.getPlan(executeFunctions, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async createPlan(
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
			const requiredBody_licenseTypeValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_licenseType',
				itemIndex,
			) as string;
			bodyFromFields['licenseType'] = requiredBody_licenseTypeValue;
			const requiredBody_licenseStartTypeValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_licenseStartType',
				itemIndex,
			) as string;
			bodyFromFields['licenseStartType'] = requiredBody_licenseStartTypeValue;

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
			`/api/v1/plans`,
			finalRequestBody,
		);
	}

	private async listPlans(
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
			`/api/v1/plans`,
			undefined,
			additionalFields,
		);
	}

	private async getPlan(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<unknown> {
		const planId = this.getNodeParameter(executeFunctions, 'planId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/plans/${planId}`,
			undefined,
		);
	}
}
