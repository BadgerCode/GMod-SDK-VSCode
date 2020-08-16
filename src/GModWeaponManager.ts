import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export class GModWeaponManager {
    constructor(private workspaceRoot: string | undefined, private samplesRoot: string) { }

    getWeapons(): GModWeapon[] {
        if (!this.workspaceRoot)
            return [];

        // TODO: Check for weapons in gamemodes folder too

        const weaponsPath = path.join(this.workspaceRoot, 'lua/weapons');
        if (this.pathExists(weaponsPath) == false) {
            return [];
        }

        // TODO: Handle non-weapon files in the weapons directory
        return fs.readdirSync(weaponsPath)
            .map(fileName => new GModWeapon(fileName.replace(".lua", ""), path.join(weaponsPath, fileName)));
    }

    editWeapon(weaponPath: string): void {
        this.openFile(weaponPath);
    }

    createSampleTTTWeapon(): void {
        if (!this.workspaceRoot) {
            return;
        }

        const weaponsPath = path.join(this.workspaceRoot, 'lua', 'weapons');
        if (this.pathExists(weaponsPath) == false) {
            fs.mkdirSync(weaponsPath, { recursive: true });
        }

        var sampleWeaponPath = path.join(weaponsPath, 'weapon_ttt_sample.lua');
        var uniqueNumber = 1;
        while (this.pathExists(sampleWeaponPath)) {
            sampleWeaponPath = path.join(weaponsPath, `weapon_ttt_sample${uniqueNumber++}.lua`);
        }

        var sampleWeaponTemplatePath = path.join(this.samplesRoot, 'weapon_ttt_sample.lua');
        var sampleWeaponLua = fs.readFileSync(sampleWeaponTemplatePath, 'utf8')

        fs.writeFileSync(sampleWeaponPath, sampleWeaponLua);

        this.openFile(sampleWeaponPath);
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }
        return true;
    }

    private openFile(filePath: string): void {
        vscode.workspace
            .openTextDocument(vscode.Uri.file(filePath))
            .then((document: vscode.TextDocument) => {
                vscode.window.showTextDocument(document, vscode.ViewColumn.Active, false).then(e => { });
            }, (error: any) => {
                console.error(error);
                debugger;
            });
    }
}


export class GModWeapon {
    name: string;
    pathToFile: string;

    constructor(name: string, pathToFile: string) {
        this.name = name;
        this.pathToFile = pathToFile;
    }
}

