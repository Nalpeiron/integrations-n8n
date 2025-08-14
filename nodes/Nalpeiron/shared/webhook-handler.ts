import { IWebhookFunctions, IWebhookResponseData } from 'n8n-workflow';
import { extractEventType, prepareResponseHeaders, prepareWebhookResponse } from './utils';

export async function handleStandardWebhook(
	webhookFunctions: IWebhookFunctions,
): Promise<IWebhookResponseData> {
	const bodyData = webhookFunctions.getBodyData();
	const headerData = webhookFunctions.getHeaderData();
	const queryData = webhookFunctions.getQueryData() as { [key: string]: any };

	const events = webhookFunctions.getNodeParameter('events') as string[];

	const eventType = extractEventType(bodyData);

	if (events.length > 0 && !events.includes(eventType)) {
		const responseCode = 200;
		const responseData = 'OK';

		return {
			webhookResponse: {
				status: responseCode,
				body: responseData,
				headers: prepareResponseHeaders(),
			},
		};
	}

	// Prepare the response
	const responseCode = 200;
	const responseData = 'OK';

	// Prepare data to return
	const returnData = prepareWebhookResponse(bodyData, headerData, queryData, eventType);

	return {
		webhookResponse: {
			status: responseCode,
			body: responseData,
			headers: prepareResponseHeaders(),
		},
		workflowData: [
			[
				{
					json: returnData,
				},
			],
		],
	};
}
