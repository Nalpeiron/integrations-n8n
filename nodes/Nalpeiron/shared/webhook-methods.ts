import { IHookFunctions, NodeOperationError } from 'n8n-workflow';
import { makeWebhookRequest } from './utils';

interface NalpeironWebhook {
	id?: string;
	uri?: string;
}

function getWebhookList(webhooksResponse: any): NalpeironWebhook[] {
	if (Array.isArray(webhooksResponse?.data)) {
		return webhooksResponse.data;
	}

	if (Array.isArray(webhooksResponse)) {
		return webhooksResponse;
	}

	return [];
}

export const createWebhookMethods = () => ({
	default: {
		async checkExists(this: IHookFunctions): Promise<boolean> {
			try {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				const webhooksResponse = await makeWebhookRequest(this, 'GET', '/api/v1/account/webhooks');
				const webhooks = getWebhookList(webhooksResponse);
				const existingWebhook = webhooks.find((webhook) => webhook.uri === webhookUrl);
				const exists = !!existingWebhook;

				if (existingWebhook?.id) {
					const staticData = this.getWorkflowStaticData('node');
					staticData.webhookId = existingWebhook.id;
				}

				return exists;
			} catch (error) {
				return false;
			}
		},
		async create(this: IHookFunctions): Promise<boolean> {
			try {
				const events = this.getNodeParameter('events') as string[];
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				if (!events || events.length === 0) {
					throw new NodeOperationError(
						this.getNode(),
						'No events selected for webhook subscription',
					);
				}

				const body = {
					uri: webhookUrl,
					subscriptions: events,
				};

				const webhook = await makeWebhookRequest(this, 'POST', '/api/v1/account/webhooks', body);

				if (webhook && webhook.id) {
					const staticData = this.getWorkflowStaticData('node');
					staticData.webhookId = webhook.id;
					return true;
				}

				throw new NodeOperationError(
					this.getNode(),
					'Failed to create webhook - no webhook ID returned',
				);
			} catch (error) {
				throw new NodeOperationError(this.getNode(), `Failed to create webhook: ${error.message}`);
			}
		},
		async delete(this: IHookFunctions): Promise<boolean> {
			try {
				const staticData = this.getWorkflowStaticData('node');
				const legacyStaticData = this.getWorkflowStaticData('global');
				const webhookId = staticData.webhookId as string;
				const legacyWebhookId = legacyStaticData.webhookId as string;

				if (webhookId) {
					await makeWebhookRequest(this, 'DELETE', `/api/v1/account/webhooks/${webhookId}`);
				} else if (legacyWebhookId) {
					const webhookUrl = this.getNodeWebhookUrl('default') as string;
					const webhooksResponse = await makeWebhookRequest(
						this,
						'GET',
						'/api/v1/account/webhooks',
					);
					const legacyWebhook = getWebhookList(webhooksResponse).find(
						(webhook) => webhook.id === legacyWebhookId,
					);

					if (legacyWebhook?.uri === webhookUrl) {
						await makeWebhookRequest(this, 'DELETE', `/api/v1/account/webhooks/${legacyWebhookId}`);
					}
				}

				delete staticData.webhookId;
				delete legacyStaticData.webhookId;

				return true;
			} catch (error) {
				return false;
			}
		},
	},
});

export type WebhookMethods = ReturnType<typeof createWebhookMethods>;
