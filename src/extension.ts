import * as vscode from 'vscode';
import { GModAddonOverviewProvider } from './GModAddonOverviewProvider';
import { GModAddonManager } from './GModAddonManager';


export function activate(context: vscode.ExtensionContext) {
	console.log('Loading extension "gmod-sdk"');


	// DEPENDENCIES
	var addonManager = new GModAddonManager(vscode.workspace.rootPath)


	// SIDE BAR
	const gmodAddonInfo = new GModAddonOverviewProvider(addonManager);
	vscode.window.registerTreeDataProvider('gmodAddonInfo', gmodAddonInfo);


	// COMMANDS

	let createAddonCommand = vscode.commands.registerCommand('gmodSDK.createAddon', () => {
		addonManager.create();
		gmodAddonInfo.refresh();
	});
	context.subscriptions.push(createAddonCommand);


	let refreshAddonInfoCommand = vscode.commands.registerCommand('gmodAddonInfo.refresh', () => {
		gmodAddonInfo.refresh();
	});
	context.subscriptions.push(refreshAddonInfoCommand);


	let createWeaponCommand = vscode.commands.registerCommand('gmodSDK.createWeapon', () => {
		vscode.window.showInformationMessage('Create weapon');
	});
	context.subscriptions.push(createWeaponCommand);
}


export function deactivate() { }
