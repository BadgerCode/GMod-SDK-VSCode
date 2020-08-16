import * as vscode from 'vscode';
import * as path from 'path';

export class GModWorkshopManager {
    private static DEBUGMODE: boolean = false;

    // TODO: Handle custom GMod folder locations & executable names
    private gmodFolderPath: string = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\garrysmod";
    private gmadExecutableName: string = "gmad.exe";
    private gmpublishExecutableName: string = "gmpublish.exe";

    constructor(private workspacePath: string | undefined, private samplesRoot: string) { }

    upload(): void {
        if (this.workspacePath == undefined)
            return;

        var gmaPath = path.join(this.workspacePath!, "workshop-file.gma");
        var thumbnailPath = path.join(this.samplesRoot, "workshop-thumbnail.jpg");

        if (GModWorkshopManager.DEBUGMODE) {
            console.log("Pretending to upload GMA");
            console.log(`GMA: ${gmaPath}`);
            console.log(`Thumbnail: ${thumbnailPath}`);
            return;
        }

        // TODO: Re-use terminal if exists/cleanup terminal on exit
        var terminal = vscode.window.createTerminal("GMod Publish");
        terminal.show();

        var gmadPath = path.join(this.gmodFolderPath, "bin", this.gmadExecutableName);
        terminal.sendText(`& "${gmadPath}" create -folder "${this.workspacePath}" -out "${gmaPath}" -warninvalid`);

        var gmpublishPath = path.join(this.gmodFolderPath, "bin", this.gmpublishExecutableName);
        terminal.sendText(`& "${gmpublishPath}" create -addon "${gmaPath}" -icon "${thumbnailPath}"`);

        // TODO: Wait for terminal to finish processing commands and delete the .gma file
    }

    updateAddon(fileID: string): void {
        if (this.workspacePath == undefined)
            return;

        var gmaPath = path.join(this.workspacePath!, "workshop-file.gma");
        var thumbnailPath = path.join(this.samplesRoot, "workshop-thumbnail.jpg");

        if (GModWorkshopManager.DEBUGMODE) {
            console.log(`Pretending to upload GMA to existing addon ${fileID}`);
            console.log(`GMA: ${gmaPath}`);
            console.log(`Thumbnail: ${thumbnailPath}`);
            return;
        }

        var terminal = vscode.window.createTerminal("GMod Publish");
        terminal.show();

        var gmadPath = path.join(this.gmodFolderPath, "bin", this.gmadExecutableName);
        terminal.sendText(`& "${gmadPath}" create -folder "${this.workspacePath}" -out "${gmaPath}" -warninvalid`);

        var gmpublishPath = path.join(this.gmodFolderPath, "bin", this.gmpublishExecutableName);
        terminal.sendText(`& "${gmpublishPath}" update -id ${fileID} -addon "${gmaPath}"`);

        // TODO: Wait for terminal to finish processing commands and delete the .gma file
    }

    updateAddonThumbnail(fileID: string, thumbnailPath: string): void {
        if (GModWorkshopManager.DEBUGMODE) {
            console.log(`Pretending to update existing addon ${fileID} thumbnail`);
            console.log(`Thumbnail: ${thumbnailPath}`);
            return;
        }


        var terminal = vscode.window.createTerminal("GMod Publish");
        terminal.show();

        var gmpublishPath = path.join(this.gmodFolderPath, "bin", this.gmpublishExecutableName);
        terminal.sendText(`& "${gmpublishPath}" update -id ${fileID} -icon "${thumbnailPath}"`);

        // TODO: Wait for terminal to finish processing commands and delete the .gma file
    }
}