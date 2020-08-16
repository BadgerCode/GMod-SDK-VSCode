import * as vscode from 'vscode';
import * as path from 'path';

export class GModWorkshopManager {
    // TODO: Handle custom GMod folder locations & executable names
    private gmodFolderPath: string = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\garrysmod";
    private gmadExecutableName: string = "gmad.exe";
    private gmpublishExecutableName: string = "gmpublish.exe";

    constructor(private workspacePath: string | undefined, private samplesRoot: string) { }

    upload(): void {
        if (this.workspacePath == undefined)
            return;

        vscode.window.showInputBox({ prompt: "This will create a NEW workshop addon. Continue? (yes/no)" })
            .then(response => {
                if (response == undefined || response.toLowerCase().trim() != "yes") {
                    vscode.window.showInformationMessage(`You cancelled the workshop upload`);
                    return;
                }

                var gmaPath = path.join(this.workspacePath!, "workshop-file.gma");
                var thumbnailPath = path.join(this.samplesRoot, "workshop-thumbnail.jpg");

                // TODO: Re-use terminal if exists/cleanup terminal on exit
                var terminal = vscode.window.createTerminal("GMod Publish");
                terminal.show();

                var gmadPath = path.join(this.gmodFolderPath, "bin", this.gmadExecutableName);
                terminal.sendText(`& "${gmadPath}" create -folder "${this.workspacePath}" -out "${gmaPath}" -warninvalid`);

                var gmpublishPath = path.join(this.gmodFolderPath, "bin", this.gmpublishExecutableName);
                terminal.sendText(`& "${gmpublishPath}" create -addon "${gmaPath}" -icon "${thumbnailPath}"`);

                // TODO: Wait for terminal to finish processing commands and delete the .gma file
            });
    }
}