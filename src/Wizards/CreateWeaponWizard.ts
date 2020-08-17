import * as vscode from 'vscode';
import { GModWeaponManager, GModWeaponTemplates } from '../GModWeaponManager';

export class CreateWeaponWizard {

    constructor(private weaponManager: GModWeaponManager) { }

    show(): Thenable<void> {
        return new Promise((resolver, rejector) => {
            vscode.window
                .showQuickPick(GModWeaponTemplates.GetGamemodes(), { placeHolder: "What gamemode is the weapon for?" })
                .then(gamemode => {
                    if (gamemode == undefined) {
                        return;
                    }

                    vscode.window
                        .showQuickPick(GModWeaponTemplates.GetTemplateNames(gamemode), { placeHolder: "Which type of weapon?" })
                        .then(weaponType => {
                            if (weaponType == undefined) {
                                return;
                            }

                            vscode.window.showInputBox({ prompt: "Enter a weapon name. e.g. cool_weapon", validateInput: this.weaponNameValidator })
                                .then(weaponName => {
                                    if (weaponName == undefined) {
                                        return;
                                    }

                                    var weaponTemplate = GModWeaponTemplates.GetTemplate(gamemode, weaponType);
                                    this.weaponManager.createWeaponFromTemplate(weaponName, weaponTemplate);
                                    resolver();
                                });
                        });
                });
        });
    }

    private static readonly WeaponNameRegex: RegExp = /^[A-Za-z0-9_-]+$/;
    private weaponNameValidator(input: string): string {
        return CreateWeaponWizard.WeaponNameRegex.test(input) ? "" : "Please only use letters, numbers and underscores.";
    }
}
