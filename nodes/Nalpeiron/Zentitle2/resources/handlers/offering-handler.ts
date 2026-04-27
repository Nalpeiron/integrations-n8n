import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../../../shared/base-resource-handler';
import { makeAuthenticatedRequest } from '../../../shared/utils';

export class OfferingResourceHandler extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
			case 'create':
				return this.createOffering(executeFunctions, itemIndex);
			case 'list':
				return this.listOfferings(executeFunctions, itemIndex);
			case 'get':
				return this.getOffering(executeFunctions, itemIndex);
			case 'update':
				return this.updateOffering(executeFunctions, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async createOffering(
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

			const requiredBody_nameValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_name',
				itemIndex,
			) as string;
			bodyFromFields['name'] = requiredBody_nameValue;
			const requiredBody_skuValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_sku',
				itemIndex,
			) as string;
			bodyFromFields['sku'] = requiredBody_skuValue;
			const requiredBody_editionIdValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_editionId',
				itemIndex,
			) as string;
			bodyFromFields['editionId'] = requiredBody_editionIdValue;
			const requiredBody_planIdValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_planId',
				itemIndex,
			) as string;
			bodyFromFields['planId'] = requiredBody_planIdValue;
			const requiredBody_seatCountValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_seatCount',
				itemIndex,
			) as number;
			bodyFromFields['seatCount'] = requiredBody_seatCountValue;
			const requiredBody_concurrencyModeValue = this.getNodeParameter(
				executeFunctions,
				'requiredBody_concurrencyMode',
				itemIndex,
			) as string;
			bodyFromFields['concurrencyMode'] = requiredBody_concurrencyModeValue;

			const requestBodyAdditionalFields = this.getNodeParameter(
				executeFunctions,
				'additionalFields',
				itemIndex,
				{},
			) as IDataObject;
			Object.assign(bodyFromFields, requestBodyAdditionalFields);
			if (requestBodyAdditionalFields['customFields']) {
				bodyFromFields['customFields'] = this.convertFixedCollectionToObject(
					requestBodyAdditionalFields['customFields'] as IDataObject,
				);
			}

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'POST',
			`/api/v1/offerings`,
			finalRequestBody,
		);
	}

	private async listOfferings(
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
			`/api/v1/offerings`,
			undefined,
			additionalFields,
		);
	}

	private async getOffering(executeFunctions: IExecuteFunctions, itemIndex: number): Promise<any> {
		const offeringId = this.getNodeParameter(executeFunctions, 'offeringId', itemIndex) as string;

		const additionalFields = this.getNodeParameter(
			executeFunctions,
			'additionalFields',
			itemIndex,
			{},
		) as IDataObject;

		return await makeAuthenticatedRequest(
			executeFunctions,
			'GET',
			`/api/v1/offerings/${offeringId}`,
			undefined,
			additionalFields,
		);
	}

	private async updateOffering(
		executeFunctions: IExecuteFunctions,
		itemIndex: number,
	): Promise<any> {
		const offeringId = this.getNodeParameter(executeFunctions, 'offeringId', itemIndex) as string;

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
			if (requestBodyAdditionalFields['customFields']) {
				bodyFromFields['customFields'] = this.convertFixedCollectionToObject(
					requestBodyAdditionalFields['customFields'] as IDataObject,
				);
			}

			finalRequestBody = bodyFromFields;
		}

		return await makeAuthenticatedRequest(
			executeFunctions,
			'PATCH',
			`/api/v1/offerings/${offeringId}`,
			finalRequestBody,
		);
	}
}
