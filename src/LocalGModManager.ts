import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';


export class LocalGModManager {
    constructor(private workspaceRoot: string | undefined) { }

    syncWorkspaceWithAddon(destinationAddonFolderName: string): void {
        if (!this.workspaceRoot) {
            return;
        }

        var addonsFolderPath = vscode.workspace.getConfiguration('gmod-sdk')
            .get<string>("garrysmodAddonsPath");

        if (addonsFolderPath == undefined) {
            // TODO: handle
            return;
        }

        var destinationPath = path.join(addonsFolderPath, destinationAddonFolderName);
        try {
            if (this.pathExists(destinationPath) == true)
                fs.removeSync(destinationPath); // TODO: Warn user

            fs.copySync(this.workspaceRoot, destinationPath, { recursive: true });

            vscode.window.showInformationMessage(`The addon has been copied to your Garry's Mod folder. ${destinationPath}`)
        }
        catch (err) {
            vscode.window.showErrorMessage(`Error copying addon to the Garry's Mod folder: ${destinationPath} ${err}`);
        }
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
