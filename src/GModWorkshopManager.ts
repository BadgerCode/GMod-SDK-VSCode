import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

export class GModWorkshopManager {
    private static DEBUGMODE: boolean = false;

    private get gmadExecutablePath(): string {
        var path = vscode.workspace.getConfiguration('gmod-sdk')
            .get<string>("gmadExecutablePath");

        if (path == undefined || !this.pathExists(path)) {
            var errorMessage = `Unable to find gmad program. To fix this, Open Settings, search for gmod.gmadExecutablePath and follow the instructions.`;
            vscode.commands.executeCommand("workbench.action.openSettings2")
                .then(() => { vscode.window.showErrorMessage(errorMessage) });
            throw errorMessage;
        }

        return path;
    }

    private get gmpublishExecutablePath(): string {
        var path = vscode.workspace.getConfiguration('gmod-sdk')
            .get<string>("gmpublishExecutablePath");

        if (path == undefined || !this.pathExists(path)) {
            var errorMessage = `Unable to find gmad program. To fix this, Open Settings, search for gmod.gmpublishExecutablePath and follow the instructions.`;
            vscode.commands.executeCommand("workbench.action.openSettings2")
                .then(() => { vscode.window.showErrorMessage(errorMessage) });
            throw errorMessage;
        }

        return path;
    }

    constructor(private workspacePath: string | undefined, private samplesRoot: string) { }

    getAddonsForUser(steamID64: string): Thenable<any[]> {
        return new Promise((resolver, rejector) => {
            axios.get(`https://steamuserinfoapi.azurewebsites.net/api/profiles/${steamID64}/workshopitems/4000?pageNumber=1`)
                .then(response => {
                    resolver(response.data.workshopItems);
                    // Loading multiple pages of items takes too long
                    // This is something to fix in the future
                })
                .catch(error => {
                    console.log(error);
                    rejector();
                });
        });
    }

    validateConfigForAddonUpload(): void {
        var gmadPath = this.gmadExecutablePath;
    }

    validateConfigForThumbnailUpload(): void {
        var gmpublishPath = this.gmpublishExecutablePath;
    }

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

        var gmadPath = this.gmadExecutablePath;
        var gmpublishPath = this.gmpublishExecutablePath;

        // TODO: Re-use terminal if exists/cleanup terminal on exit
        var terminal = vscode.window.createTerminal("GMod Publish");
        terminal.show();

        terminal.sendText(`& "${gmadPath}" create -folder "${this.workspacePath}" -out "${gmaPath}" -warninvalid`);

        terminal.sendText(`& "${gmpublishPath}" create -addon "${gmaPath}" -icon "${thumbnailPath}"`);

        // TODO: Wait for terminal to finish processing commands and delete the .gma file
    }

    updateAddon(fileID: string): void {
        if (this.workspacePath == undefined)
            return;

        var gmaPath = path.join(this.workspacePath!, "workshop-file.gma");

        if (GModWorkshopManager.DEBUGMODE) {
            console.log(`Pretending to upload GMA to existing addon ${fileID}`);
            console.log(`GMA: ${gmaPath}`);
            return;
        }

        var gmadPath = this.gmadExecutablePath;
        var gmpublishPath = this.gmpublishExecutablePath;

        var terminal = vscode.window.createTerminal("GMod Publish");
        terminal.show();

        terminal.sendText(`& "${gmadPath}" create -folder "${this.workspacePath}" -out "${gmaPath}" -warninvalid`);

        terminal.sendText(`& "${gmpublishPath}" update -id ${fileID} -addon "${gmaPath}"`);

        // TODO: Wait for terminal to finish processing commands and delete the .gma file
    }

    updateAddonThumbnail(fileID: string, thumbnailPath: string): void {
        if (GModWorkshopManager.DEBUGMODE) {
            console.log(`Pretending to update existing addon ${fileID} thumbnail`);
            console.log(`Thumbnail: ${thumbnailPath}`);
            return;
        }

        var gmpublishPath = this.gmpublishExecutablePath;

        var terminal = vscode.window.createTerminal("GMod Publish");
        terminal.show();

        terminal.sendText(`& "${gmpublishPath}" update -id ${fileID} -icon "${thumbnailPath}"`);

        // TODO: Wait for terminal to finish processing commands and delete the .gma file
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

export enum WorkshopItemVisibility {
    Public = 0,
    FriendsOnly = 1,
    Hidden = 2,
    Unlisted = 3
}
