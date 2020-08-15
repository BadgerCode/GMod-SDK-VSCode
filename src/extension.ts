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




	let testCommand = vscode.commands.registerCommand('gmodSDK.test', () => {
		if (vscode.workspace.rootPath == undefined)
			return;

		var terminal = vscode.window.createTerminal("GMod Publish");
		terminal.show();
		terminal.sendText("echo \"Hello world\"");
		terminal.sendText(`& "C:\\Program Files (x86)\\Steam\\steamapps\\common\\garrysmod\\bin\\gmad.exe" create -folder "${vscode.workspace.rootPath}" -warninvalid`)
	});
	context.subscriptions.push(testCommand);



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
