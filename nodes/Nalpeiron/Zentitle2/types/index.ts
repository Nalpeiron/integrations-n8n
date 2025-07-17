import type { IExecuteFunctions } from 'n8n-workflow';
import type { INalpeironCredentials } from '../utils';

export interface IResourceHandler {
	executeOperation(
		executeFunctions: IExecuteFunctions,
		resource: string,
		operation: string,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any>;
}
