import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getOAuth2AccessToken, INalpeironCredentials } from './utils';
import { BaseResourceHandler } from './base-resource-handler';

export interface INodeCoordinator {
	execute(
		context: IExecuteFunctions,
		resourceHandlers: Record<string, BaseResourceHandler>,
	): Promise<INodeExecutionData[][]>;
}

/**
 * Coordinator class that handles the main execution logic for the node
 * This simplifies the main node class and centralizes execution logic
 */
export class NodeCoordinator implements INodeCoordinator {
	/**
	 * Execute the node operation
	 */
	async execute(
		context: IExecuteFunctions,
		resourceHandlers: Record<string, BaseResourceHandler>,
	): Promise<INodeExecutionData[][]> {
		const items = context.getInputData();
		const credentials = (await context.getCredentials('nalpeiron-Api')) as INalpeironCredentials;

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const result = await this.executeItemOperation(context, credentials, i, resourceHandlers);
				returnData.push({
					json: result,
					pairedItem: {
						item: i,
					},
				});
			} catch (error) {
				if (context.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

	/**
	 * Execute operation for a single item
	 */
	private async executeItemOperation(
		context: IExecuteFunctions,
		credentials: INalpeironCredentials,
		itemIndex: number,
		resourceHandlers: Record<string, BaseResourceHandler>,
	): Promise<any> {
		const resource = context.getNodeParameter('resource', itemIndex) as string;
		const operation = context.getNodeParameter('operation', itemIndex) as string;

		// Get OAuth2 access token
		const accessToken = await getOAuth2AccessToken(credentials, context.helpers, context.getNode());

		// Find and execute the appropriate resource handler
		const resourceHandler = resourceHandlers[resource];
		if (!resourceHandler) {
			throw new NodeOperationError(context.getNode(), `The resource "${resource}" is not known!`);
		}

		return await resourceHandler.executeOperation(
			context,
			operation,
			credentials,
			accessToken,
			itemIndex,
		);
	}
}

// Export singleton instance
export const nodeCoordinator = new NodeCoordinator();
