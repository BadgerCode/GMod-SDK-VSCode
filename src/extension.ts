import * as vscode from 'vscode';
import { GModMenuProvider } from './GModMenuProvider';


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "gmod-sdk" is now active!');

	// SIDE BAR
	const gmodMenuProvider = new GModMenuProvider(vscode.workspace.rootPath);
	vscode.window.registerTreeDataProvider('gmodMenuSideBar', gmodMenuProvider);


	// COMMANDS

	let createAddonCommand = vscode.commands.registerCommand('gmodsdk.createAddon', () => {
		vscode.window.showInformationMessage('Creating GMod addon');
	});

	context.subscriptions.push(createAddonCommand);
}


export function deactivate() { }
