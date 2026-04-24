import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest } from '../../../shared/utils';

export class FeatureResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'create':
				return this.createFeature(executeFunctions, itemIndex);
			case 'list':
				return this.listFeatures(executeFunctions, itemIndex);
			case 'get':
				return this.getFeature(executeFunctions, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async createFeature(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
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

			const requiredBody_typeValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_type',
				itemIndex,
			) as string;
			bodyFromFields['type'] = requiredBody_typeValue;
			const requiredBody_keyValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_key',
				itemIndex,
			) as string;
			bodyFromFields['key'] = requiredBody_keyValue;

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
			`/api/v1/features`,
			finalRequestBody,
		);
	}

	private async listFeatures(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/features`,
			undefined,
			additionalFields,
		);
	}

	private async getFeature(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const featureId = this.getNodeParameter(executeFunctions, 'featureId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/features/${featureId}`,
			undefined,
		);
	}
}
