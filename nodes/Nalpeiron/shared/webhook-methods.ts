import { IHookFunctions, NodeOperationError } from 'n8n-workflow';
import { makeWebhookRequest } from './utils';

export const createWebhookMethods = () => ({
	default: {
		async checkExists(this: IHookFunctions): Promise<boolean> {
			try {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				const webhooks = await makeWebhookRequest(this, 'GET', '/api/v1/account/webhooks');

				if (webhooks && webhooks.data) {
					const existingWebhook = webhooks.data.find((webhook: any) => webhook.uri === webhookUrl);
					const exists = !!existingWebhook;

					if (exists && existingWebhook) {
						const staticData = this.getWorkflowStaticData('global');
						staticData.webhookId = existingWebhook.id;
					}

					return exists;
				}

				return false;
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
					const staticData = this.getWorkflowStaticData('global');
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
				const staticData = this.getWorkflowStaticData('global');
				const webhookId = staticData.webhookId as string;

				if (!webhookId) {
					return true;
				}

				await makeWebhookRequest(this, 'DELETE', `/api/v1/account/webhooks/${webhookId}`);

				delete staticData.webhookId;

				return true;
			} catch (error) {
				return false;
			}
		},
	},
});

export type WebhookMethods = ReturnType<typeof createWebhookMethods>;
