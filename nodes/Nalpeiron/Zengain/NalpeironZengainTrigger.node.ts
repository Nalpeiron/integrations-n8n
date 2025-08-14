import {
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { handleStandardWebhook } from '../shared/webhook-handler';
import { createWebhookMethods } from '../shared/webhook-methods';
import { WEBHOOK_EVENT_OPTIONS } from './webhooks/events';

export class NalpeironZengainTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nalpeiron Zengain Trigger',
		name: 'nalpeironZengainTrigger',
		icon: 'file:zengain.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle webhooks from Nalpeiron Zengain',
		defaults: {
			name: 'Nalpeiron Zengain Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		credentials: [
			{
				name: 'nalpeiron-Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'Events to listen to',
				options: WEBHOOK_EVENT_OPTIONS,
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return handleStandardWebhook(this);
	}

	webhookMethods = createWebhookMethods();
}
