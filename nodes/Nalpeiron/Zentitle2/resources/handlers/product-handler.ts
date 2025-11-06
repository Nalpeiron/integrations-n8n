import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest } from '../../../shared/utils';

export class ProductResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'list':
				return this.listProducts(executeFunctions, itemIndex);
			case 'get':
				return this.getProduct(executeFunctions, itemIndex);
			case 'listAttributes':
				return this.listAttributes(executeFunctions, itemIndex);
			case 'getAttributes':
				return this.getAttributes(executeFunctions, itemIndex);
			case 'listEditions':
				return this.listEditions(executeFunctions, itemIndex);
			case 'getEditions':
				return this.getEditions(executeFunctions, itemIndex);
			case 'listEditionsAttributes':
				return this.listEditionsAttributes(executeFunctions, itemIndex);
			case 'getEditionsAttributes':
				return this.getEditionsAttributes(executeFunctions, itemIndex);
			case 'listEditionsFeatures':
				return this.listEditionsFeatures(executeFunctions, itemIndex);
			case 'getEditionsFeatures':
				return this.getEditionsFeatures(executeFunctions, itemIndex);
			case 'listFeatures':
				return this.listFeatures(executeFunctions, itemIndex);
			case 'getFeatures':
				return this.getFeatures(executeFunctions, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async listProducts(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products`,
			undefined,
			additionalFields,
		);
	}

	private async getProduct(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}`,
			undefined,
		);
	}

	private async listAttributes(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/attributes`,
			undefined,
		);
	}

	private async getAttributes(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const attributeId = this.getNodeParameter(executeFunctions, 'attributeId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/attributes/${attributeId}`,
			undefined,
		);
	}

	private async listEditions(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/editions`,
			undefined,
			additionalFields,
		);
	}

	private async getEditions(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/editions/${editionId}`,
			undefined,
		);
	}

	private async listEditionsAttributes(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/editions/${editionId}/attributes`,
			undefined,
		);
	}

	private async getEditionsAttributes(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;
		const attributeId = this.getNodeParameter(executeFunctions, 'attributeId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/editions/${editionId}/attributes/${attributeId}`,
			undefined,
		);
	}

	private async listEditionsFeatures(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/editions/${editionId}/features`,
			undefined,
		);
	}

	private async getEditionsFeatures(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;
		const featureId = this.getNodeParameter(executeFunctions, 'featureId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/editions/${editionId}/features/${featureId}`,
			undefined,
		);
	}

	private async listFeatures(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/features`,
			undefined,
		);
	}

	private async getFeatures(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const featureId = this.getNodeParameter(executeFunctions, 'featureId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/features/${featureId}`,
			undefined,
		);
	}
}
