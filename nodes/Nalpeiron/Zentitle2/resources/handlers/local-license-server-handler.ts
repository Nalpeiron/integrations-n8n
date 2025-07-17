import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { BaseResourceHandler } from '../base-resource-handler';
import { makeAuthenticatedRequest, type INalpeironCredentials } from '../../utils';

export class LocallicenseserverResourceHandler extends BaseResourceHandler {
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
				return this.listLocallicenseservers(executeFunctions, credentials, accessToken, itemIndex);
			case 'get':
				return this.getLocallicenseserver(executeFunctions, credentials, accessToken, itemIndex);
			case 'listConfig':
				return this.listConfig(executeFunctions, credentials, accessToken, itemIndex);
			case 'listEntitlement':
				return this.listEntitlement(executeFunctions, credentials, accessToken, itemIndex);
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

	private async listLocallicenseservers(
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
			`/api/v1/local-license-servers`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
			additionalFields,
		);
	}

	private async getLocallicenseserver(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		const localLicenseServerId = this.getNodeParameter(
			executeFunctions,
			'localLicenseServerId',
			itemIndex,
		) as string;

		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/local-license-servers/${localLicenseServerId}`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listConfig(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/local-license-servers/config`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}

	private async listEntitlement(
		executeFunctions: IExecuteFunctions,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		return await makeAuthenticatedRequest(
			'GET',
			`/api/v1/local-license-servers/entitlement`,
			accessToken,
			credentials,
			executeFunctions.helpers,
			undefined,
		);
	}
}
