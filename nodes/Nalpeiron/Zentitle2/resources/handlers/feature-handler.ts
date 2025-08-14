import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest, type INalpeironCredentials } from '../../../shared/utils';

export class FeatureResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'list':
				return this.listFeatures(executeFunctions, credentials, accessToken, itemIndex);
			case 'get':
				return this.getFeature(executeFunctions, credentials, accessToken, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async listFeatures(
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
			`/api/v1/features`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async getFeature(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const featureId = this.getNodeParameter(executeFunctions, 'featureId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/features/${featureId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}
}
