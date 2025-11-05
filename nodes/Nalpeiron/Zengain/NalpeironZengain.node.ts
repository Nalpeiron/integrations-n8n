import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getAllNodeProperties } from './property-registry';
import { nodeCoordinator } from '../shared/node-coordinator';
import { resourceHandlers } from '../Zengain/resources';

export class NalpeironZengain implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nalpeiron Zengain',
		name: 'nalpeironZengain',
		icon: 'file:zengain.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Nalpeiron Zengain API',
		defaults: {
			name: 'Nalpeiron Zengain',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'nalpeironOAuth2Api',
				required: true,
			},
		],
		properties: getAllNodeProperties(),
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await nodeCoordinator.execute(this, resourceHandlers);
	}
}
