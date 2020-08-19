import * as vscode from 'vscode';
import { GModWorkshopManager } from '../GModWorkshopManager';

export class WorkshopUploadWizard {

    constructor(private workshopManager: GModWorkshopManager) { }

    show(targetWorkshopFileID: string | undefined): void {
        this.workshopManager.validateConfigForAddonUpload();

        if (targetWorkshopFileID != undefined) {
            this.updateExistingItem(targetWorkshopFileID);
            return;
        }

        vscode.window
            .showQuickPick(["New Addon", "Existing Addon"], { placeHolder: "Upload a new addon or update an existing addon?" })
            .then(response => {
                if (response == undefined)
                    return;

                var shouldUploadNewAddon = response == "New Addon";
                if (shouldUploadNewAddon) {
                    vscode.window.showInputBox({ prompt: "This will upload a NEW addon to the workshop. Type YES to continue", placeHolder: "YES" })
                        .then(confirmation => {
                            if (confirmation == undefined || confirmation.toLowerCase().trim() != "yes") {
                                vscode.window.showInformationMessage(`You cancelled the workshop upload`);
                                return;
                            }
                            this.workshopManager.upload();
                        });
                }
                else {
                    vscode.window.showInputBox({ prompt: "Enter the workshop file ID. This can be found at the end of the URL. E.g. https://steamcommunity.com/sharedfiles/filedetails/?id=2086515808 has a file ID of 2086515808" })
                        .then(fileID => {
                            if (fileID == undefined) {
                                vscode.window.showInformationMessage(`You cancelled the workshop upload`);
                                return;
                            }

                            this.updateExistingItem(fileID);
                        });
                }
            });
    }

    private updateExistingItem(fileID: string): void {
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

                this.workshopManager.updateAddon(trimmedFileID);
            });
    }
}