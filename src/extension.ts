import * as vscode from 'vscode';
import { GModAddonInfoView } from './GModAddonInfoView';
import { GModAddonManager } from './GModAddonManager';
import { GModAddonWeaponsView, GModWeaponMenuItem } from './GModAddonWeaponsView';
import { GModWeaponManager } from './GModWeaponManager';
import { GModWorkshopView } from './GModWorkshopView';
import { GModWorkshopManager } from './GModWorkshopManager';
import { WorkshopUploadWizard } from './Wizards/WorkshopUploadWizard';


export function activate(context: vscode.ExtensionContext) {
	console.log('Loading extension "gmod-sdk"');

	// DEPENDENCIES
	var addonManager = new GModAddonManager(vscode.workspace.rootPath);
	var weaponManager = new GModWeaponManager(vscode.workspace.rootPath, context.asAbsolutePath('resources/samples'));
	var workshopManager = new GModWorkshopManager(vscode.workspace.rootPath, context.asAbsolutePath('resources/samples'));


	// SIDE BAR
	const gmodAddonInfoView = new GModAddonInfoView(addonManager);
	vscode.window.registerTreeDataProvider('gmodAddonInfo', gmodAddonInfoView);

	const gmodAddonWeaponView = new GModAddonWeaponsView(weaponManager);
	vscode.window.registerTreeDataProvider('gmodAddonWeapons', gmodAddonWeaponView);

	const gmodWorkshopView = new GModWorkshopView();
	vscode.window.registerTreeDataProvider('gmodWorkshop', gmodWorkshopView);


	// COMMANDS
	let createAddonCommand = vscode.commands.registerCommand('gmodSDK.createAddon', () => {
		addonManager.create();
		gmodAddonInfoView.refresh();
	});
	context.subscriptions.push(createAddonCommand);

	let createWeaponCommand = vscode.commands.registerCommand('gmodSDK.createWeapon', () => {
		if (vscode.workspace.rootPath == undefined) {
			vscode.window.showInformationMessage("Please open a folder.")
			return;
		}

		weaponManager.createSampleTTTWeapon();
		gmodAddonWeaponView.refresh();
	});
	context.subscriptions.push(createWeaponCommand);

	let uploadWorkshopCommand = vscode.commands.registerCommand('gmodSDK.uploadAddon', () => {
		if (addonManager.getAddonInfo() == undefined) {
			vscode.window.showInformationMessage("addon.json missing. Please create an addon first.")
			return;
		}

		new WorkshopUploadWizard(workshopManager).show();
	});
	context.subscriptions.push(uploadWorkshopCommand);




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
		gmodWorkshopView.refresh();
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
