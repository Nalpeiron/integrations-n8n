import {
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';
import { createWebhookMethods } from '../shared/webhook-methods';
import { WEBHOOK_EVENT_OPTIONS } from './webhooks/events';
import { handleStandardWebhook } from '../shared/webhook-handler';

export class NalpeironZentitle2Trigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nalpeiron Zentitle2 Trigger',
		name: 'nalpeironZentitle2Trigger',
		icon: 'file:zentitle.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle webhooks from Nalpeiron Zentitle2',
		defaults: {
			name: 'Nalpeiron Zentitle2 Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
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
				description: 'The events to listen for',
				options: WEBHOOK_EVENT_OPTIONS,
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return handleStandardWebhook(this);
	}

	webhookMethods = createWebhookMethods();
}
