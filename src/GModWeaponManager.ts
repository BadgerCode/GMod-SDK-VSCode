import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

export class GModWeaponManager {
    constructor(private workspaceRoot: string | undefined, private samplesRoot: string) { }

    getWeapons(): GModWeapon[] {
        if (!this.workspaceRoot) return [];

        var weapons: GModWeapon[] = [];

        const weaponsPath = path.join(this.workspaceRoot, "lua/weapons");
        if (this.pathExists(weaponsPath)) {
            weapons = weapons
                .concat(this.findWeapons(weaponsPath)
                    .map(fullPath => new GModWeapon(path.basename(fullPath, ".lua"), `lua/weapons`, fullPath))
                );
        }

        const sandboxToolsPath = path.join(this.workspaceRoot, "lua/weapons/gmod_tool/stools");
        if (this.pathExists(sandboxToolsPath)) {
            weapons = weapons
                .concat(this.findWeapons(sandboxToolsPath)
                    .map(fullPath => new GModWeapon(path.basename(fullPath, ".lua"), `lua/weapons/gmod_tool/stools`, fullPath))
                );
        }

        const gamemodesPath = path.join(this.workspaceRoot, "gamemodes");
        if (this.pathExists(gamemodesPath)) {
            var gamemodes = fs.readdirSync(gamemodesPath, { withFileTypes: true })
                .filter((fileEntity) => fileEntity.isDirectory())
                .map((directory) => directory.name);

            for (let i = 0; i < gamemodes.length; i++) {
                const gamemode = gamemodes[i];
                var gamemodeWeaponsPath = path.join(gamemodesPath, gamemode, "entities/weapons/");

                if (this.pathExists(gamemodeWeaponsPath)) {
                    weapons = weapons.concat(
                        this.findWeapons(gamemodeWeaponsPath)
                            .map(fullPath => new GModWeapon(path.basename(fullPath, ".lua"), `gamemodes/${gamemode}/entities/weapons`, fullPath)));
                }

                const gamemodeSandboxToolsPath = path.join(gamemodesPath, gamemode, "entities/weapons/gmod_tool/stools");
                if (this.pathExists(gamemodeSandboxToolsPath)) {
                    weapons = weapons
                        .concat(this.findWeapons(gamemodeSandboxToolsPath)
                            .map(fullPath => new GModWeapon(path.basename(fullPath, ".lua"), `gamemodes/${gamemode}/entities/weapons/gmod_tool/stools`, fullPath))
                        );
                }
            }
        }

        return weapons;
    }

    private findWeapons(directoryPath: string): string[] {
        var directoryItems = fs.readdirSync(directoryPath, { withFileTypes: true });
        var weaponPaths: string[] = [];

        for (let i = 0; i < directoryItems.length; i++) {
            const dirItem = directoryItems[i];
            var fullPath = path.join(directoryPath, dirItem.name);

            if (dirItem.isFile()) {
                if (dirItem.name.endsWith(".lua")) {
                    weaponPaths.push(fullPath);
                }
            }
            else if (dirItem.isDirectory()) {
                var weaponLuaFiles = glob.sync(path.join(fullPath, "@(shared|init|cl_init).lua"));
                if (weaponLuaFiles.length != 0)
                    weaponPaths.push(fullPath);
            }
        }

        return weaponPaths;
    }

    editWeapon(weaponPath: string): void {
        // TODO: If path is a folder, open folder
        if (this.pathExists(weaponPath) == false)
            return;

        if (fs.lstatSync(weaponPath).isDirectory()) {
            this.openDirectory(weaponPath);
        }
        else {
            this.openFile(weaponPath);
        }
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
            sampleWeaponPath = path.join(
                weaponsPath,
                `${weaponTemplate.WeaponNamePrefix}${weaponName}${uniqueNumber++}.lua`
            );
        }

        var sampleWeaponTemplatePath = path.join(this.samplesRoot, "weapons", weaponTemplate.Filename);
        // TODO: Check if template exists
        var sampleWeaponLua = fs.readFileSync(sampleWeaponTemplatePath, "utf8");

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
        vscode.workspace.openTextDocument(vscode.Uri.file(filePath)).then(
            (document: vscode.TextDocument) => {
                vscode.window.showTextDocument(document, vscode.ViewColumn.Active, false).then((e) => { });
            },
            (error: any) => {
                console.error(error);
                debugger;
            }
        );
    }

    private openDirectory(directoryPath: string): void {
        var weaponLuaFiles = glob.sync(path.join(directoryPath, "@(shared|init|cl_init).lua"));
        if (weaponLuaFiles.length == 0)
            return;

        vscode.workspace.openTextDocument(vscode.Uri.file(weaponLuaFiles[0])).then(
            (document: vscode.TextDocument) => {
                vscode.window.showTextDocument(document, vscode.ViewColumn.Active, false).then((e) => { });
            },
            (error: any) => {
                console.error(error);
                debugger;
            }
        );
    }
}

export class GModWeapon {
    name: string;
    pathToFile: string;
    relativePath: string;

    constructor(name: string, relativePath: string, pathToFile: string) {
        this.name = name;
        this.relativePath = relativePath;
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
