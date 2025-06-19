import * as vscode from 'vscode';

type Command = {
	key: string;
	name: string;
	type: 'command';
	command: string;
	when?: string;
	langId?: string;
}

type Bindings = {
	key: string;
	name: string;
	type: 'command' | 'bindings';
	bindings: KeyBind[];
	when?: string;
	langId?: string;
}

type KeyBind = Command | Bindings;

type FindResult = {
	status: 'found' | 'partial' | 'none';
	binding?: KeyBind;
}

// --- Global Variables ---
let inputBox: vscode.InputBox | undefined = undefined;
const SEQUENCE_SEPARATOR = ' > ';

/**
 * Disposes the input box if it exists and resets the global variable.
 */
function disposeInputBox() {
	if (inputBox) {
		vscode.commands.executeCommand('setContext', 'key-sequencer.active', false);
		inputBox.dispose();
		inputBox = undefined;
		console.log('Key Sequencer: Disposed.');
	}
}

/**
 * TODO: Dummy function
 * @param sequence input sequence
 * @returns
 */
function findCommand(sequence: string): Command | boolean {
	// TODO: vscode.workspace.getConfiguration('key-sequencer')
	if (sequence.startsWith('f')) {
		if (sequence === 'f') {
			return {
				key: 'f',
				name: 'File',
				type: 'command',
				command: 'workbench.view.explorer',
			};
		} else if (sequence === 'w') {
			if (sequence === 'w') {
				return true;
			}
			if (sequence === 'wo') {
				return {
					key: 'o',
					name: 'Close Ohters',
					type: 'command',
					command: 'workbench.action.closeOtherEditors',
				};
			}
		}
	}
	return false;
}

export function activate(context: vscode.ExtensionContext) {

	const startCommand = vscode.commands.registerCommand('key-sequencer.start', () => {
		if (inputBox) {
			return;
		}
		vscode.commands.executeCommand('setContext', 'key-sequencer.active', true);
		inputBox = vscode.window.createInputBox();
		inputBox.title = 'Key Sequencer';
		inputBox.prompt = 'SPC > ';
		inputBox.value = '';
		inputBox.ignoreFocusOut = true;
		inputBox.onDidChangeValue(sequence => {
			if (!inputBox) {
				return;
			}
			const match = findCommand(sequence);
			if (typeof match === 'object') {
				console.log('Command found:', match.command);
				vscode.commands.executeCommand(match.command);
				disposeInputBox();
				return;
			}

			if (match === true) {
				inputBox.validationMessage = undefined;
			} else {
				inputBox.validationMessage = `sequence '${sequence}' not found`;
			}

			inputBox!.prompt = `SPC > ${sequence.split('').join(SEQUENCE_SEPARATOR)}`;
		});
		// No action on accept, just to prevent default behavior
		inputBox.onDidAccept(() => { });

		inputBox.onDidHide(() => {
			disposeInputBox();
		});
		inputBox.show();
	});

	const cancelCommand = vscode.commands.registerCommand('key-sequencer.cancel', disposeInputBox);

	context.subscriptions.push(startCommand, cancelCommand);
}

export function deactivate() {
	disposeInputBox();
}
