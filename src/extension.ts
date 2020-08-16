import * as vscode from 'vscode';
import { GModAddonInfoView, GModMenuItem } from './GModAddonInfoView';
import { GModAddonManager } from './GModAddonManager';
import { GModAddonWeaponsView, GModWeaponMenuItem } from './GModAddonWeaponsView';
import { GModWeaponManager } from './GModWeaponManager';


export function activate(context: vscode.ExtensionContext) {
	console.log('Loading extension "gmod-sdk"');


	// DEPENDENCIES
	var addonManager = new GModAddonManager(vscode.workspace.rootPath);
	var weaponManager = new GModWeaponManager(vscode.workspace.rootPath, context.asAbsolutePath('resources/samples'));


	// SIDE BAR
	const gmodAddonInfoView = new GModAddonInfoView(addonManager);
	vscode.window.registerTreeDataProvider('gmodAddonInfo', gmodAddonInfoView);

	const gmodAddonWeaponView = new GModAddonWeaponsView(weaponManager);
	vscode.window.registerTreeDataProvider('gmodAddonWeapons', gmodAddonWeaponView);


	// COMMANDS
	let createAddonCommand = vscode.commands.registerCommand('gmodSDK.createAddon', () => {
		addonManager.create();
		gmodAddonInfoView.refresh();
	});
	context.subscriptions.push(createAddonCommand);

	let createWeaponCommand = vscode.commands.registerCommand('gmodSDK.createWeapon', () => {
		weaponManager.createSampleTTTWeapon();
		gmodAddonWeaponView.refresh();
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
		gmodAddonInfoView.refresh();
		gmodAddonWeaponView.refresh();
	});
	context.subscriptions.push(refreshAddonInfoCommand);

	let editAddonInfoCommand = vscode.commands.registerCommand('gmodAddonInfo.edit', () => {
		addonManager.openEditor();
	});
	context.subscriptions.push(editAddonInfoCommand);

	let editWeaponCommand = vscode.commands.registerCommand('gmodWeapon.edit', (item: GModWeaponMenuItem) => {
		if (item.weapon == undefined) return;
		weaponManager.editWeapon(item.weapon.pathToFile);
	});
	context.subscriptions.push(editWeaponCommand);
}


export function deactivate() { }
