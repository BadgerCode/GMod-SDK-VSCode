import * as vscode from 'vscode';
import * as path from 'path';
import { WorkshopUploadWizard } from './Wizards/WorkshopUploadWizard';
import { WorkshopThumbnailWizard } from './Wizards/WorkshopThumbnailWizard';
import { CreateWeaponWizard } from './Wizards/CreateWeaponWizard';
import { GModAddonManager } from './Services/GModAddonManager';
import { GModWeaponManager } from './Services/GModWeaponManager';
import { GModWorkshopManager } from './Services/GModWorkshopManager';
import { LocalGModManager } from './Services/LocalGModManager';
import { GModAddonInfoView } from './Views/GModAddonInfoView';
import { GModAddonWeaponsView, GModWeaponMenuItem } from './Views/GModAddonWeaponsView';
import { GModWorkshopView, GModWorkshopMenuItem } from './Views/GModWorkshopView';
import { AddonTypeWizard } from './Wizards/AddonTypeWizard';
import { AddonTagsWizard } from './Wizards/AddonTagsWizard';


export function activate(context: vscode.ExtensionContext) {
	console.log('Loading extension "gmod-sdk"');

	// DEPENDENCIES
	var addonManager = new GModAddonManager(vscode.workspace.rootPath);
	var weaponManager = new GModWeaponManager(vscode.workspace.rootPath, context.asAbsolutePath('resources/samples'));
	var workshopManager = new GModWorkshopManager(vscode.workspace.rootPath, context.asAbsolutePath('resources/samples'));
	var localGModManager = new LocalGModManager(vscode.workspace.rootPath);



	// SIDE BAR
	const gmodAddonInfoView = new GModAddonInfoView(addonManager);
	vscode.window.registerTreeDataProvider('gmodAddonInfo', gmodAddonInfoView);

	const gmodAddonWeaponView = new GModAddonWeaponsView(vscode.workspace.rootPath, weaponManager);
	vscode.window.registerTreeDataProvider('gmodAddonWeapons', gmodAddonWeaponView);

	const gmodWorkshopView = new GModWorkshopView(workshopManager);
	vscode.window.registerTreeDataProvider('gmodWorkshop', gmodWorkshopView);


	// COMMANDS
	let createAddonCommand = vscode.commands.registerCommand('gmodSDK.createAddon', () => {
		addonManager.create();
		gmodAddonInfoView.refresh();
	});
	context.subscriptions.push(createAddonCommand);


	let copyToGModFolderCommand = vscode.commands.registerCommand('gmodSDK.copyToLocalGarrysmod', () => {
		if (vscode.workspace.rootPath == undefined) {
			vscode.window.showInformationMessage("Please open a folder.")
			return;
		}

		localGModManager.syncWorkspaceWithAddon(path.basename(vscode.workspace.rootPath));
	});
	context.subscriptions.push(copyToGModFolderCommand);


	let createWeaponCommand = vscode.commands.registerCommand('gmodSDK.createWeapon', () => {
		if (vscode.workspace.rootPath == undefined) {
			vscode.window.showInformationMessage("Please open a folder.")
			return;
		}

		new CreateWeaponWizard(weaponManager)
			.show()
			.then(() => {
				gmodAddonWeaponView.refresh();
			});
	});
	context.subscriptions.push(createWeaponCommand);


	let uploadWorkshopCommand = vscode.commands.registerCommand('gmodSDK.uploadAddon', (targetWorkshopItem: GModWorkshopMenuItem | undefined) => {
		if (addonManager.getAddonInfo() == undefined) {
			vscode.window.showInformationMessage("addon.json missing. Please create an addon first.")
			return;
		}

		var targetWorkshopItemID = undefined;
		if (targetWorkshopItem != undefined && targetWorkshopItem.workshopFileId != undefined) {
			targetWorkshopItemID = targetWorkshopItem.workshopFileId;
		}

		new WorkshopUploadWizard(workshopManager).show(targetWorkshopItemID);
	});
	context.subscriptions.push(uploadWorkshopCommand);


	let updateWorkshopThumbnailCommand = vscode.commands.registerCommand('gmodSDK.updateAddonThumbnail', (targetWorkshopItem: GModWorkshopMenuItem | undefined) => {
		var targetWorkshopItemID = undefined;
		if (targetWorkshopItem != undefined && targetWorkshopItem.workshopFileId != undefined) {
			targetWorkshopItemID = targetWorkshopItem.workshopFileId;
		}

		new WorkshopThumbnailWizard(workshopManager).show(targetWorkshopItemID);
	});
	context.subscriptions.push(updateWorkshopThumbnailCommand);



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

	let setAddonTypeCommand = vscode.commands.registerCommand('gmodAddonInfo.setType', () => {
		new AddonTypeWizard(addonManager)
			.show()
			.then(() => { gmodAddonInfoView.refresh(); });
	});
	context.subscriptions.push(setAddonTypeCommand);

	let setAddonTagsCommand = vscode.commands.registerCommand('gmodAddonInfo.setTags', () => {
		new AddonTagsWizard(addonManager)
			.show()
			.then(() => { gmodAddonInfoView.refresh(); });
	});
	context.subscriptions.push(setAddonTagsCommand);


	let editWeaponCommand = vscode.commands.registerCommand('gmodWeapon.edit', (item: GModWeaponMenuItem) => {
		if (item.weapon == undefined) return;
		weaponManager.editWeapon(item.weapon.pathToFile);
	});
	context.subscriptions.push(editWeaponCommand);

	let selectSteamIDCommand = vscode.commands.registerCommand('gmodWorkshop.selectSteamID', () => {
		vscode.window.showInputBox({ prompt: "Enter your long Steam ID (SteamID64)" })
			.then(response => {
				if (response == undefined)
					return;

				var steamID = response.trim();
				if (isNaN(Number(steamID))) {
					vscode.window.showInformationMessage(`"${steamID}" is not a valid Steam ID. E.g. 70561198021123456`);
					return;
				}

				vscode.workspace.getConfiguration('gmod-sdk')
					.update("steamID", steamID, vscode.ConfigurationTarget.Global)
					.then(() => {
						setTimeout(() => {
							gmodWorkshopView.refresh();
						}, 1000);
					});
			});
	});
	context.subscriptions.push(selectSteamIDCommand);
}


export function deactivate() { }
