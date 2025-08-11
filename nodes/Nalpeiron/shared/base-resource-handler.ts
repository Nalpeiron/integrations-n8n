import type { IExecuteFunctions, INode } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { INalpeironCredentials } from './utils';

export abstract class BaseResourceHandler {
	abstract executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any>;

	/**
	 * Get a node parameter value
	 */
	protected getNodeParameter(
		executeFunctions: IExecuteFunctions,
		parameterName: string,
		itemIndex: number,
		fallbackValue?: any,
	): any {
		return executeFunctions.getNodeParameter(parameterName, itemIndex, fallbackValue);
	}

	/**
	 * Handle unknown operations by throwing an error
	 */
	protected handleUnknownOperation(operation: string, node: INode): never {
		throw new NodeApiError(node, {
			message: `Unknown operation: ${operation}`,
			description: `The operation "${operation}" is not supported`,
		});
	}
}
