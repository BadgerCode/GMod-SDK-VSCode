import * as vscode from 'vscode';
import { GModAddonInfoView } from './GModAddonInfoView';
import { GModAddonManager } from './GModAddonManager';
import { GModAddonWeaponsView, GModWeaponMenuItem } from './GModAddonWeaponsView';
import { GModWeaponManager } from './GModWeaponManager';
import { GModWorkshopView } from './GModWorkshopView';
import { GModWorkshopManager } from './GModWorkshopManager';


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

		vscode.window
			.showQuickPick(["NEW", "Existing Addon"], { placeHolder: "Upload a new addon or update an existing addon?" })
			.then(response => {
				if (response == undefined)
					return;

				var shouldUploadNewAddon = response == "NEW";
				if (shouldUploadNewAddon) {
					vscode.window.showInputBox({ prompt: "This will upload a NEW addon to the workshop. Type YES to continue", placeHolder: "YES" })
						.then(confirmation => {
							if (confirmation == undefined || confirmation.toLowerCase().trim() != "yes") {
								vscode.window.showInformationMessage(`You cancelled the workshop upload`);
								return;
							}
							workshopManager.upload();
						});
				}
				else {
					vscode.window.showInputBox({ prompt: "Enter the workshop file ID. This can be found at the end of the URL. E.g. https://steamcommunity.com/sharedfiles/filedetails/?id=2086515808 has a file ID of 2086515808" })
						.then(fileID => {
							if (fileID == undefined) {
								vscode.window.showInformationMessage(`You cancelled the workshop upload`);
								return;
							}

							var trimmedFileID = fileID.trim();
							if (isNaN(Number(trimmedFileID))) {
								vscode.window.showInformationMessage(`"${trimmedFileID}" is not a valid workshop File ID. E.g. https://steamcommunity.com/sharedfiles/filedetails/?id=2086515808 has a file ID of 2086515808`);
								return;
							}

							vscode.window.showInputBox({ prompt: `This will UPDATE the addon ${trimmedFileID}. Type YES to continue`, placeHolder: "YES" })
								.then(confirmation => {
									if (confirmation == undefined || confirmation.toLowerCase().trim() != "yes") {
										vscode.window.showInformationMessage(`You cancelled the workshop upload`);
										return;
									}

									workshopManager.updateAddon(trimmedFileID);
								});
						});
				}
			});
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
