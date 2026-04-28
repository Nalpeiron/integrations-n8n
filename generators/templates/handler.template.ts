{{imports}}

export class {{className}} extends BaseResourceHandler {
	async executeOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
	): Promise<unknown> {
		switch (operation) {
{{operations}}
			default:
				return this.handleUnknownOperation(operation, executeFunctions.getNode());
		}
	}

{{methods}}
}
