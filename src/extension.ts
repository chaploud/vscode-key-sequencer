import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('key-sequencer.start', () => {
		vscode.window.showInformationMessage('Hello World from Key Sequencer!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
