import * as vscode from 'vscode';
import * as fs from 'fs';
import { GModWorkshopManager } from '../GModWorkshopManager';

export class WorkshopThumbnailWizard {

    constructor(private workshopManager: GModWorkshopManager) { }

    show(): void {
        vscode.window.showOpenDialog({
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: "Select thumbnail",
            filters: {
                'Images': ['jpg']
            }
        }).then(uri => {
            if (uri == undefined) {
                vscode.window.showInformationMessage(`You cancelled the thumbnail upload`);
                return;
            }

            var thumbnailPath = uri[0].fsPath;
            if (this.pathExists(thumbnailPath) == false) {
                vscode.window.showErrorMessage(`Unable to find thumbnail- ${thumbnailPath}`);
                return;
            }

            vscode.window.showInputBox({ prompt: "Enter the workshop file ID. This can be found at the end of the URL. E.g. https://steamcommunity.com/sharedfiles/filedetails/?id=2086515808 has a file ID of 2086515808" })
                .then(fileID => {
                    if (fileID == undefined)
                        return;

                    var trimmedFileID = fileID.trim();
                    if (isNaN(Number(trimmedFileID))) {
                        vscode.window.showErrorMessage(`"${trimmedFileID}" is not a valid workshop File ID. E.g. https://steamcommunity.com/sharedfiles/filedetails/?id=2086515808 has a file ID of 2086515808`);
                        return;
                    }

                    vscode.window.showInputBox({ prompt: `This will UPDATE the thumbnail for addon ${trimmedFileID}. Type YES to continue`, placeHolder: "YES" })
                        .then(confirmation => {
                            if (confirmation == undefined || confirmation.toLowerCase().trim() != "yes") {
                                vscode.window.showInformationMessage(`You cancelled the workshop upload`);
                                return;
                            }

                            this.workshopManager.updateAddonThumbnail(trimmedFileID, thumbnailPath);
                        });
                });
        });
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }
        return true;
    }
}