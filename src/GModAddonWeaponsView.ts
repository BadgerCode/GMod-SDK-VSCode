import * as vscode from 'vscode';
import * as path from 'path';
import { GModWeaponManager, GModWeapon } from './GModWeaponManager';

export class GModAddonWeaponsView implements vscode.TreeDataProvider<GModWeaponMenuItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<GModWeaponMenuItem | undefined> = new vscode.EventEmitter<GModWeaponMenuItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GModWeaponMenuItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined, private weaponManager: GModWeaponManager) { }

    getTreeItem(element: GModWeaponMenuItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: GModWeaponMenuItem): Thenable<GModWeaponMenuItem[]> {
        if (this.workspaceRoot == undefined)
            return Promise.resolve([]);

        if (!element) {
            return Promise.resolve([
                new GModWeaponMenuItem("createweapon", "Create a Weapon", undefined, vscode.TreeItemCollapsibleState.Collapsed),
                new GModWeaponMenuItem("weapons", "Weapons", "folder.svg", vscode.TreeItemCollapsibleState.Expanded)
            ]);
        }
        else if (element.id == "weapons") {
            return Promise.resolve(this.weaponManager.getWeapons().map((weapon, index) => GModWeaponMenuItem.CreateWeaponItem(weapon)));
        }
        else if (element.id == "createweapon") {
            return Promise.resolve([
                new GModWeaponMenuItem("createweapon.ttt", "Create a TTT Weapon")
            ]);
        }
        else {
            return Promise.resolve([]);
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}

export class GModWeaponMenuItem extends vscode.TreeItem {
    static CreateWeaponItem(weapon: GModWeapon): GModWeaponMenuItem {
        var menuItem = new GModWeaponMenuItem(`weapons.${weapon.name}`, weapon.name);
        menuItem.weapon = weapon;
        return menuItem;
    }

    weapon: GModWeapon | undefined;

    constructor(public readonly id: string,
        label: string,
        iconName: string | undefined = undefined,
        collapsedState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
    ) {
        super(label, collapsedState)

        this.contextValue = id;

        if (iconName) {
            this.iconPath = {
                light: path.join(__filename, '..', '..', 'resources', 'light', iconName),
                dark: path.join(__filename, '..', '..', 'resources', 'dark', iconName)
            };
        }
    }

    get tooltip(): string {
        return this.label || "";
    }

    get description(): string {
        return "";
    }
}
