import * as vscode from 'vscode';
import { GModAddonManager, AddonType } from '../Services/GModAddonManager';

export class AddonTypeWizard {

    constructor(private addonManager: GModAddonManager) { }

    show(): Thenable<void> {
        return new Promise((resolver, rejector) => {
            var types = Object.keys(AddonType);

            vscode.window
                .showQuickPick(types, { placeHolder: "Select what type of addon you are making" })
                .then(type => {
                    if (type == undefined) {
                        return;
                    }

                    var addonInfo = this.addonManager.getAddonInfo();
                    if (addonInfo == undefined) {
                        vscode.window.showErrorMessage("addon.json is missing.")
                        return;
                    }

                    addonInfo.type = AddonType[type as keyof typeof AddonType];
                    this.addonManager.save(addonInfo);
                    resolver();
                });
        });
    }
}
