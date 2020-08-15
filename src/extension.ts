import * as vscode from 'vscode';
import { GModAddonOverviewProvider, GModMenuItem } from './GModAddonOverviewProvider';
import { GModAddonManager } from './GModAddonManager';


export function activate(context: vscode.ExtensionContext) {
	console.log('Loading extension "gmod-sdk"');


	// DEPENDENCIES
	var addonManager = new GModAddonManager(vscode.workspace.rootPath, context.asAbsolutePath('resources/samples'))


	// SIDE BAR
	const gmodAddonInfo = new GModAddonOverviewProvider(addonManager);
	vscode.window.registerTreeDataProvider('gmodAddonInfo', gmodAddonInfo);


	// COMMANDS
	let createAddonCommand = vscode.commands.registerCommand('gmodSDK.createAddon', () => {
		addonManager.create();
		gmodAddonInfo.refresh();
	});
	context.subscriptions.push(createAddonCommand);

	let createWeaponCommand = vscode.commands.registerCommand('gmodSDK.createWeapon', () => {
		addonManager.createSampleTTTWeapon();
		gmodAddonInfo.refresh();
	});
	context.subscriptions.push(createWeaponCommand);


	// INTERNAL COMMANDS
	let refreshAddonInfoCommand = vscode.commands.registerCommand('gmodAddonInfo.refresh', () => {
		gmodAddonInfo.refresh();
	});
	context.subscriptions.push(refreshAddonInfoCommand);

	let editAddonInfoCommand = vscode.commands.registerCommand('gmodAddonInfo.edit', () => {
		addonManager.openEditor();
	});
	context.subscriptions.push(editAddonInfoCommand);

	let editWeaponCommand = vscode.commands.registerCommand('gmodWeapon.edit', (item: GModMenuItem) => {
		if (item.weapon == undefined) return;
		addonManager.editWeapon(item.weapon.pathToFile);
	});
	context.subscriptions.push(editWeaponCommand);
}


export function deactivate() { }
