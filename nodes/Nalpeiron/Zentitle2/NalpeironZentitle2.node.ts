import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getAllNodeProperties } from './property-registry';
import { nodeCoordinator } from '../shared/node-coordinator';
import { resourceHandlers } from './resources';

export class NalpeironZentitle2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nalpeiron Zentitle2',
		name: 'nalpeironZentitle2',
		icon: 'file:zentitle.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Nalpeiron Zentitle2 API',
		defaults: {
			name: 'Nalpeiron Zentitle2',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'nalpeiron-Api',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials?.baseUrl || "https://api.nalpeiron.com"}}',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'N-TenantId': '={{$credentials.tenantId}}',
			},
		},
		properties: getAllNodeProperties(),
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return await nodeCoordinator.execute(this, resourceHandlers);
	}
}
