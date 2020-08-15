import * as vscode from 'vscode';
import * as path from 'path';
import { GModAddonManager, GModAddonInfo, GModWeapon } from './GModAddonManager';

export class GModAddonOverviewProvider implements vscode.TreeDataProvider<GModMenuItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<GModMenuItem | undefined> = new vscode.EventEmitter<GModMenuItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GModMenuItem | undefined> = this._onDidChangeTreeData.event;

    private addonInfo: GModAddonInfo | undefined;

    constructor(private addonManager: GModAddonManager) {
        this.addonInfo = this.addonManager.getAddonInfo();
    }

    getTreeItem(element: GModMenuItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: GModMenuItem): Thenable<GModMenuItem[]> {
        if (this.addonInfo == undefined)
            return Promise.resolve([]);

        if (!element) {
            return Promise.resolve([
                new GModMenuItem("addoninfo", "Addon Information", "", undefined, vscode.TreeItemCollapsibleState.Expanded),
                new GModMenuItem("weapons", "Weapons", "", "folder.svg", vscode.TreeItemCollapsibleState.Collapsed)
            ]);
        }
        else if (element.id == "addoninfo") {
            return Promise.resolve([
                new GModMenuItem("addoninfo.title", "Title", this.addonInfo.title),
                new GModMenuItem("addoninfo.description", "Description", this.addonInfo.description),
                new GModMenuItem("addoninfo.type", "Type", this.addonInfo.type),
                new GModMenuItem("addoninfo.tags", "Tags", "", undefined, vscode.TreeItemCollapsibleState.Expanded),
                new GModMenuItem("addoninfo.ignoredFiles", "Ignored files", "", undefined, vscode.TreeItemCollapsibleState.Collapsed)
            ]);
        }
        else if (element.id == "addoninfo.tags") {
            return Promise.resolve(
                this.addonInfo.tags.map((tag, index) => new GModMenuItem(`addoninfo.tags.${index}`, tag, ""))
            );
        }
        else if (element.id == "addoninfo.ignoredFiles") {
            return Promise.resolve(
                this.addonInfo.ignore.map((filePath, index) => new GModMenuItem(`addoninfo.ignoredFiles.${index}`, filePath, ""))
            );
        }
        else if (element.id == "weapons") {
            return Promise.resolve(
                this.addonManager.getWeapons().map((weapon, index) => {
                    var menuItem = new GModMenuItem(`weapons.${index}`, weapon.name, "");
                    menuItem.weapon = weapon;
                    return menuItem;
                })
            );
        }
        else {
            return Promise.resolve([]);
        }
    }

    refresh(): void {
        this.addonInfo = this.addonManager.getAddonInfo();
        this._onDidChangeTreeData.fire(undefined);
    }
}

export class GModMenuItem extends vscode.TreeItem {
    weapon: GModWeapon | undefined;

    constructor(
        public readonly id: string,
        public readonly label: string,
        private value: string,
        iconName: string | undefined = undefined,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
    ) {
        super(label, collapsibleState)

        if (iconName) {
            this.iconPath = {
                light: path.join(__filename, '..', '..', 'resources', 'light', iconName),
                dark: path.join(__filename, '..', '..', 'resources', 'dark', iconName)
            };
        }

        this.contextValue = id;
    }

    get tooltip(): string {
        return `${this.label}-${this.value}`;
    }

    get description(): string {
        return this.value;
    }
}
