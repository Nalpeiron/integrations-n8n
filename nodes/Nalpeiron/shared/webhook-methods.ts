import { IHookFunctions, NodeOperationError } from 'n8n-workflow';
import { getOAuth2AccessToken, makeWebhookRequest, INalpeironCredentials } from './utils';

export const createWebhookMethods = () => ({
	default: {
		async checkExists(this: IHookFunctions): Promise<boolean> {
			try {
				const credentials = (await this.getCredentials('nalpeiron-Api')) as INalpeironCredentials;
				const accessToken = await getOAuth2AccessToken(credentials, this.helpers, this.getNode());

				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				const webhooks = await makeWebhookRequest(
					'GET',
					'/api/v1/account/webhooks',
					accessToken,
					credentials,
					this.helpers,
				);

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
				const credentials = (await this.getCredentials('nalpeiron-Api')) as INalpeironCredentials;

				const accessToken = await getOAuth2AccessToken(credentials, this.helpers, this.getNode());

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

				const webhook = await makeWebhookRequest(
					'POST',
					'/api/v1/account/webhooks',
					accessToken,
					credentials,
					this.helpers,
					body,
				);

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

				const credentials = (await this.getCredentials('nalpeiron-Api')) as INalpeironCredentials;
				const accessToken = await getOAuth2AccessToken(credentials, this.helpers, this.getNode());

				await makeWebhookRequest(
					'DELETE',
					`/api/v1/account/webhooks/${webhookId}`,
					accessToken,
					credentials,
					this.helpers,
				);

				delete staticData.webhookId;

				return true;
			} catch (error) {
				return false;
			}
		},
	},
});

export type WebhookMethods = ReturnType<typeof createWebhookMethods>;
