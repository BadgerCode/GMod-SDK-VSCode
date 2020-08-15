import * as vscode from 'vscode';
import { GModAddonOverviewProvider } from './GModAddonOverviewProvider';
import { GModAddonManager } from './GModAddonManager';


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "gmod-sdk" is now active!');


	// DEPENDENCIES
	var addonManager = new GModAddonManager(vscode.workspace.rootPath)


	// SIDE BAR
	const gmodAddonInfo = new GModAddonOverviewProvider(addonManager);
	vscode.window.registerTreeDataProvider('gmodAddonInfo', gmodAddonInfo);


	// COMMANDS

	let createAddonCommand = vscode.commands.registerCommand('gmodsdk.createAddon', () => {
		addonManager.create();
	});

	context.subscriptions.push(createAddonCommand);
}


export function deactivate() { }
