import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export class GModAddonManager {
    constructor(private workspaceRoot: string | undefined) { }

    getAddonInfo(): GModAddonInfo | undefined {
        if (!this.workspaceRoot) {
            return undefined;
        }

        const addonJSONPath = path.join(this.workspaceRoot, 'addon.json');
        if (this.pathExists(addonJSONPath) == false) {
            return undefined;
        }

        var addonInfo = <GModAddonInfo>JSON.parse(fs.readFileSync(addonJSONPath, 'utf8'));
        return addonInfo;
    }

    create(): void {
        if (!this.workspaceRoot) {
            vscode.window.showErrorMessage('Please open a folder before creating an addon.');
            return;
        }

        const addonJSONPath = path.join(this.workspaceRoot, 'addon.json');
        if (this.pathExists(addonJSONPath)) {
            vscode.window.showErrorMessage('GMod addon already exists!');
            return;
        }

        var addonInfo = new GModAddonInfo("My GMod Addon");

        this.save(addonInfo);
        vscode.window.showInformationMessage('Created addon.json');
    }

    save(addonInfo: GModAddonInfo) {
        if (!this.workspaceRoot)
            return;

        const addonJSONPath = path.join(this.workspaceRoot, 'addon.json');
        fs.writeFileSync(addonJSONPath, JSON.stringify(addonInfo, null, 4));
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


export class GModAddonInfo {
    /**
     * Name of addon. Can be changed after publishing to the Steam Workshop.
     */
    title: string;

    /**
     * A short description of the addon. Can be changed after publishing to the Steam Workshop.
     */
    description: string;

    /**
     * Type of addon. Used for filtering addons on the Steam Workshop.
     */
    type: AddonType;

    /**
     * Up to two tags. Used for filtering addons on the Steam Workshop.
     */
    tags: AddonTag[];

    /**
     * A list of relative-paths to files that should not be included when publishing the addon.
     */
    ignore: string[];

    constructor(title: string) {
        this.title = title;
        this.description = "";
        this.type = AddonType.ServerContent;
        this.tags = [AddonTag.Fun];
        this.ignore = [".git/*", "README.md"];
    }
}

export enum AddonType {
    ServerContent = "servercontent",
    Gamemode = "gamemode",
    Map = "map",
    Weapon = "weapon",
    Vehicle = "vehicle",
    NPC = "npc",
    Tool = "tool",
    Effects = "effects",
    Model = "model"
}

export enum AddonTag {
    Fun = "fun",
    Roleplay = "roleplay",
    Scenic = "scenic",
    Movie = "movie",
    Realism = "realism",
    Cartoon = "cartoon",
    Water = "water",
    Comic = "comic",
    Build = "build"
}
