import * as vscode from 'vscode';
import * as fs from 'fs';
import { GModWorkshopManager } from '../Services/GModWorkshopManager';

export class WorkshopThumbnailWizard {

    constructor(private workshopManager: GModWorkshopManager) { }

    show(targetWorkshopFileID: string | undefined): void {
        this.workshopManager.validateConfigForThumbnailUpload();

        this.showThumbnailSelector()
            .then(thumbnailPath => {
                if (targetWorkshopFileID != undefined) {
                    this.updateThumbnail(targetWorkshopFileID, thumbnailPath);
                    return;
                }

                vscode.window.showInputBox({ prompt: "Enter the workshop file ID. This can be found at the end of the URL. E.g. https://steamcommunity.com/sharedfiles/filedetails/?id=2086515808 has a file ID of 2086515808" })
                    .then(fileID => {
                        if (fileID == undefined) {
                            vscode.window.showInformationMessage(`You cancelled the thumbnail upload`);
                            return;
                        }

                        this.updateThumbnail(fileID, thumbnailPath);
                    });
            });
    }

    private showThumbnailSelector(): Thenable<string> {
        return new Promise((resolver, rejector) => {
            vscode.window.showOpenDialog({
                canSelectFolders: false,
                canSelectMany: false,
                openLabel: "Select thumbnail",
                filters: {
                    'Images': ['jpg']
                }
            }).then(uri => {
                if (uri == undefined) {
                    return;
                }

                var thumbnailPath = uri[0].fsPath;
                if (this.pathExists(thumbnailPath) == false) {
                    vscode.window.showErrorMessage(`Unable to find thumbnail- ${thumbnailPath}`);
                    return;
                }

                resolver(thumbnailPath);
            });
        });
    }

    private updateThumbnail(targetFileID: string, thumbnailPath: string) {
        if (isNaN(Number(targetFileID))) {
            vscode.window.showErrorMessage(`"${targetFileID}" is not a valid workshop File ID. E.g. https://steamcommunity.com/sharedfiles/filedetails/?id=2086515808 has a file ID of 2086515808`);
            return;
        }

        vscode.window.showInputBox({ prompt: `This will UPDATE the thumbnail for addon ${targetFileID}. Type YES to continue`, placeHolder: "YES" })
            .then(confirmation => {
                if (confirmation == undefined || confirmation.toLowerCase().trim() != "yes") {
                    vscode.window.showInformationMessage(`You cancelled the workshop upload`);
                    return;
                }

                this.workshopManager.updateAddonThumbnail(targetFileID, thumbnailPath);
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