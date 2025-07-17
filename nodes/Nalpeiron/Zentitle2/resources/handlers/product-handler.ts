import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../base-resource-handler';
import { makeAuthenticatedRequest, type INalpeironCredentials } from '../../utils';

export class ProductResourceHandler extends BaseResourceHandler {
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
				return this.listProducts(executeFunctions, credentials, accessToken, itemIndex);
			case 'get':
				return this.getProduct(executeFunctions, credentials, accessToken, itemIndex);
			case 'listAttributes':
				return this.listAttributes(executeFunctions, credentials, accessToken, itemIndex);
			case 'getAttributes':
				return this.getAttributes(executeFunctions, credentials, accessToken, itemIndex);
			case 'listEditions':
				return this.listEditions(executeFunctions, credentials, accessToken, itemIndex);
			case 'getEditions':
				return this.getEditions(executeFunctions, credentials, accessToken, itemIndex);
			case 'listEditionsAttributes':
				return this.listEditionsAttributes(executeFunctions, credentials, accessToken, itemIndex);
			case 'getEditionsAttributes':
				return this.getEditionsAttributes(executeFunctions, credentials, accessToken, itemIndex);
			case 'listEditionsFeatures':
				return this.listEditionsFeatures(executeFunctions, credentials, accessToken, itemIndex);
			case 'getEditionsFeatures':
				return this.getEditionsFeatures(executeFunctions, credentials, accessToken, itemIndex);
			case 'listFeatures':
				return this.listFeatures(executeFunctions, credentials, accessToken, itemIndex);
			case 'getFeatures':
				return this.getFeatures(executeFunctions, credentials, accessToken, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async listProducts(
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
			`/api/v1/products`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async getProduct(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listAttributes(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}/attributes`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async getAttributes(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const attributeId = this.getNodeParameter(executeFunctions, 'attributeId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}/attributes/${attributeId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listEditions(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}/editions`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async getEditions(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}/editions/${editionId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listEditionsAttributes(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}/editions/${editionId}/attributes`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async getEditionsAttributes(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;
		const attributeId = this.getNodeParameter(executeFunctions, 'attributeId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}/editions/${editionId}/attributes/${attributeId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listEditionsFeatures(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}/editions/${editionId}/features`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async getEditionsFeatures(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;
		const featureId = this.getNodeParameter(executeFunctions, 'featureId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}/editions/${editionId}/features/${featureId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listFeatures(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}/features`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async getFeatures(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const featureId = this.getNodeParameter(executeFunctions, 'featureId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/products/${productId}/features/${featureId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}
}
