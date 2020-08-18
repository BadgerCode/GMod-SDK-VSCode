import * as vscode from "vscode";
import * as path from "path";
import { GModWeaponManager, GModWeapon } from "./GModWeaponManager";

export class GModAddonWeaponsView implements vscode.TreeDataProvider<GModWeaponMenuItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<GModWeaponMenuItem | undefined> = new vscode.EventEmitter<GModWeaponMenuItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GModWeaponMenuItem | undefined> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined, private weaponManager: GModWeaponManager) {}

    getTreeItem(element: GModWeaponMenuItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: GModWeaponMenuItem): Thenable<GModWeaponMenuItem[]> {
        if (this.workspaceRoot == undefined) return Promise.resolve([]);

        return Promise.resolve(
            this.weaponManager.getWeapons().map((weapon, index) => GModWeaponMenuItem.CreateWeaponItem(weapon))
        );
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}

export class GModWeaponMenuItem extends vscode.TreeItem {
    static CreateWeaponItem(weapon: GModWeapon): GModWeaponMenuItem {
        var menuItem = new GModWeaponMenuItem(`weapons.${weapon.relativePath}.${weapon.name}`, weapon.name, weapon.relativePath);
        menuItem.weapon = weapon;
        return menuItem;
    }

    weapon: GModWeapon | undefined;
    relativePath: string | undefined;

    constructor(
        public readonly id: string,
        label: string,
        relativePath: string | undefined = undefined,
        iconName: string | undefined = undefined,
        collapsedState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
    ) {
        super(label, collapsedState);

        this.relativePath = relativePath;
        this.contextValue = id;

        if (iconName) {
            this.iconPath = {
                light: path.join(__filename, "..", "..", "resources", "light", iconName),
                dark: path.join(__filename, "..", "..", "resources", "dark", iconName)
            };
        }
    }

    get tooltip(): string {
        return this.weapon?.pathToFile || "";
    }

    get description(): string {
        return this.relativePath || "";
    }
}
