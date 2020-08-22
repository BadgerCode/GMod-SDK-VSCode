import * as vscode from 'vscode';
import { GModAddonManager, AddonTag } from '../Services/GModAddonManager';

export class AddonTagsWizard {

    constructor(private addonManager: GModAddonManager) { }

    show(): Thenable<void> {
        return new Promise((resolver, rejector) => {
            var types = Object.keys(AddonTag);

            vscode.window
                .showQuickPick(types, { placeHolder: "Select the first tag" })
                .then(tag1 => {
                    if (tag1 == undefined) {
                        return;
                    }

                    var firstTag = AddonTag[tag1 as keyof typeof AddonTag];

                    types.splice(types.indexOf(tag1), 1);
                    types.unshift("None");

                    vscode.window
                        .showQuickPick(types, { placeHolder: "Select the second tag" })
                        .then(tag2 => {
                            if (tag2 == undefined) {
                                return;
                            }

                            var tags = [firstTag];

                            if (tag2 != "None") {
                                var secondTag = AddonTag[tag2 as keyof typeof AddonTag];
                                tags.push(secondTag);
                            }

                            var addonInfo = this.addonManager.getAddonInfo();
                            if (addonInfo == undefined) {
                                vscode.window.showErrorMessage("addon.json is missing.")
                                return;
                            }

                            addonInfo.tags = tags;
                            this.addonManager.save(addonInfo);
                            resolver();
                        });
                });
        });
    }
}
