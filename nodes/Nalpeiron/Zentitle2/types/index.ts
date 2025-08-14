import type { IExecuteFunctions } from 'n8n-workflow';
import type { INalpeironCredentials } from '../../shared/utils';

export interface IResourceHandler {
	executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any>;
}
