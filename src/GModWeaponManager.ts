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

    createWeaponFromTemplate(weaponName: string, weaponTemplate: any): void {
        if (!this.workspaceRoot) {
            return;
        }

        const weaponsPath = path.join(this.workspaceRoot, weaponTemplate.DestinationPath);
        if (this.pathExists(weaponsPath) == false) {
            fs.mkdirSync(weaponsPath, { recursive: true });
        }

        var sampleWeaponPath = path.join(weaponsPath, `${weaponTemplate.WeaponNamePrefix}${weaponName}.lua`);
        var uniqueNumber = 1;
        while (this.pathExists(sampleWeaponPath)) {
            sampleWeaponPath = path.join(weaponsPath, `${weaponTemplate.WeaponNamePrefix}${weaponName}${uniqueNumber++}.lua`);
        }

        var sampleWeaponTemplatePath = path.join(this.samplesRoot, 'weapons', weaponTemplate.Filename);
        // TODO: Check if template exists
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


export class GModWeaponTemplates {
    private static readonly WeaponSamples: any = {
        TTT: {
            Label: "TTT",
            Weapons: {
                Primary: {
                    Filename: "weapon_ttt_primary_sample.lua",
                    WeaponNamePrefix: "weapon_ttt_",
                    DestinationPath: "lua/weapons/"
                },
                Secondary: {
                    Filename: "weapon_ttt_secondary_sample.lua",
                    WeaponNamePrefix: "weapon_ttt_",
                    DestinationPath: "lua/weapons/"
                },
                Grenade: {
                    Filename: "weapon_ttt_grenade_sample.lua",
                    WeaponNamePrefix: "weapon_ttt_",
                    DestinationPath: "lua/weapons/"
                },
                Traitor: {
                    Filename: "weapon_ttt_traitor_sample.lua",
                    WeaponNamePrefix: "weapon_ttt_",
                    DestinationPath: "lua/weapons/"
                },
                Detective: {
                    Filename: "weapon_ttt_detective_sample.lua",
                    WeaponNamePrefix: "weapon_ttt_",
                    DestinationPath: "lua/weapons/"
                }
            }
        },
        Sandbox: {
            Label: "Sandbox",
            Weapons: {
                Main: {
                    Filename: "weapon_sandbox_main_sample.lua",
                    WeaponNamePrefix: "weapon_",
                    DestinationPath: "lua/weapons/"
                },
                ToolGun: {
                    Filename: "weapon_sandbox_toolgun_sample.lua",
                    WeaponNamePrefix: "",
                    DestinationPath: "lua/weapons/gmod_tool/stools/"
                }
            }
        }
    };

    public static GetGamemodes(): string[] {
        return Object.keys(GModWeaponTemplates.WeaponSamples);
    }

    public static GetTemplateNames(gamemode: string): string[] {
        return Object.keys(GModWeaponTemplates.WeaponSamples[gamemode].Weapons);
    }

    public static GetTemplate(gamemode: string, template: string): any {
        return GModWeaponTemplates.WeaponSamples[gamemode].Weapons[template];
    }
}

