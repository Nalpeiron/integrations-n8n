import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest } from '../../../shared/utils';

export class ProductResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<unknown> {
		switch (operation) {
			case 'create':
				return this.createProduct(executeFunctions, itemIndex);
			case 'list':
				return this.listProducts(executeFunctions, itemIndex);
			case 'get':
				return this.getProduct(executeFunctions, itemIndex);
			case 'update':
				return this.updateProduct(executeFunctions, itemIndex);
			case 'createAttributes':
				return this.createAttributes(executeFunctions, itemIndex);
			case 'listAttributes':
				return this.listAttributes(executeFunctions, itemIndex);
			case 'getAttributes':
				return this.getAttributes(executeFunctions, itemIndex);
			case 'updateAttributes':
				return this.updateAttributes(executeFunctions, itemIndex);
			case 'createEditions':
				return this.createEditions(executeFunctions, itemIndex);
			case 'listEditions':
				return this.listEditions(executeFunctions, itemIndex);
			case 'getEditions':
				return this.getEditions(executeFunctions, itemIndex);
			case 'listEditionsAttributes':
				return this.listEditionsAttributes(executeFunctions, itemIndex);
			case 'getEditionsAttributes':
				return this.getEditionsAttributes(executeFunctions, itemIndex);
			case 'updateEditionsAttributes':
				return this.updateEditionsAttributes(executeFunctions, itemIndex);
			case 'listEditionsFeatures':
				return this.listEditionsFeatures(executeFunctions, itemIndex);
			case 'getEditionsFeatures':
				return this.getEditionsFeatures(executeFunctions, itemIndex);
			case 'createFeatures':
				return this.createFeatures(executeFunctions, itemIndex);
			case 'listFeatures':
				return this.listFeatures(executeFunctions, itemIndex);
			case 'getFeatures':
				return this.getFeatures(executeFunctions, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async createProduct(
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
			`/api/v1/products`,
			finalRequestBody,
		);
	}

	private async listProducts(
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
			`/api/v1/products`,
			undefined,
			additionalFields,
		);
	}

	private async getProduct(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}`,
			undefined,
		);
	}

	private async updateProduct(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

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
			'PATCH',
			`/api/v1/products/${productId}`,
			finalRequestBody,
		);
	}

	private async createAttributes(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

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

			const requiredBody_keyValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_key',
				itemIndex,
			) as string;
			bodyFromFields['key'] = requiredBody_keyValue;
			const requiredBody_typeValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_type',
				itemIndex,
			) as string;
			bodyFromFields['type'] = requiredBody_typeValue;

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
			`/api/v1/products/${productId}/attributes`,
			finalRequestBody,
		);
	}

	private async listAttributes(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
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
	): Promise<unknown> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const attributeId = this.getNodeParameter(executeFunctions, 'attributeId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/attributes/${attributeId}`,
			undefined,
		);
	}

	private async updateAttributes(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const attributeId = this.getNodeParameter(executeFunctions, 'attributeId', itemIndex) as string;

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
			'PATCH',
			`/api/v1/products/${productId}/attributes/${attributeId}`,
			finalRequestBody,
		);
	}

	private async createEditions(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

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
			`/api/v1/products/${productId}/editions`,
			finalRequestBody,
		);
	}

	private async listEditions(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
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

	private async getEditions(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
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
	): Promise<unknown> {
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
	): Promise<unknown> {
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

	private async updateEditionsAttributes(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;
		const editionId = this.getNodeParameter(executeFunctions, 'editionId', itemIndex) as string;
		const attributeId = this.getNodeParameter(executeFunctions, 'attributeId', itemIndex) as string;

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
			'PATCH',
			`/api/v1/products/${productId}/editions/${editionId}/attributes/${attributeId}`,
			finalRequestBody,
		);
	}

	private async listEditionsFeatures(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
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
	): Promise<unknown> {
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

	private async createFeatures(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

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
			`/api/v1/products/${productId}/features`,
			finalRequestBody,
		);
	}

	private async listFeatures(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
		const productId = this.getNodeParameter(executeFunctions, 'productId', itemIndex) as string;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/products/${productId}/features`,
			undefined,
		);
	}

	private async getFeatures(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<unknown> {
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
