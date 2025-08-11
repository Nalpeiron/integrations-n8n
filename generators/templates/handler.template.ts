{{imports}}

export class {{className}} extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		credentials: INalpeironCredentials,
		accessToken: string,
		itemIndex: number,
	): Promise<any> {
		switch (operation) {
{{operations}}
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

{{methods}}
}
