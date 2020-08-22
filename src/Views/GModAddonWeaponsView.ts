import * as vscode from "vscode";
import * as path from "path";
import { GModWeaponManager, GModWeapon, GModWeaponOverview } from "../Services/GModWeaponManager";

export class GModAddonWeaponsView implements vscode.TreeDataProvider<GModWeaponMenuItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<GModWeaponMenuItem | undefined> = new vscode.EventEmitter<GModWeaponMenuItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GModWeaponMenuItem | undefined> = this._onDidChangeTreeData.event;

    private weaponOverview: GModWeaponOverview;

    constructor(private workspaceRoot: string | undefined, private weaponManager: GModWeaponManager) {
        this.weaponOverview = this.weaponManager.getWeapons();
    }


    getTreeItem(element: GModWeaponMenuItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: GModWeaponMenuItem): Thenable<GModWeaponMenuItem[]> {
        if (this.workspaceRoot == undefined) return Promise.resolve([]);

        if (element == undefined) {
            var treeItems = [];

            if (this.weaponOverview.sandboxTools.length != 0)
                treeItems.push(GModWeaponMenuItem.CreateSubMenu('category.stools', "Sandbox Tools"));

            var weapons = this.weaponOverview.weapons.map((weapon, index) => GModWeaponMenuItem.CreateWeaponItem(weapon));
            return Promise.resolve(treeItems.concat(weapons));
        }
        else if (element.id == 'category.stools') {
            return Promise.resolve(this.weaponOverview.sandboxTools.map((tool, index) => GModWeaponMenuItem.CreateWeaponItem(tool)));
        }
        else {
            return Promise.resolve([]);
        }
    }

    refresh(): void {
        this.weaponOverview = this.weaponManager.getWeapons();
        this._onDidChangeTreeData.fire(undefined);
    }
}

export class GModWeaponMenuItem extends vscode.TreeItem {
    static CreateWeaponItem(weapon: GModWeapon): GModWeaponMenuItem {
        var menuItem = new GModWeaponMenuItem(`weapons.${weapon.relativePath}.${weapon.name}`, weapon.name, weapon.relativePath);
        menuItem.weapon = weapon;
        return menuItem;
    }

    static CreateSubMenu(id: string, label: string): GModWeaponMenuItem {
        return new GModWeaponMenuItem(id, label, undefined, "folder.svg", vscode.TreeItemCollapsibleState.Expanded);
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

        this.tooltip = this.weapon?.pathToFile;
        this.description = this.relativePath;
    }
}
