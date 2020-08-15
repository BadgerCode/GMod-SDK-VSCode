import * as vscode from 'vscode';
import * as path from 'path';
import { GModAddonManager, GModAddonInfo } from './GModAddonManager';

export class GModMenuProvider implements vscode.TreeDataProvider<GModMenuItem> {
    private addonInfo: GModAddonInfo | undefined;

    constructor(private addonManager: GModAddonManager) {
        this.addonInfo = this.addonManager.getAddonInfo();
    }

    getTreeItem(element: GModMenuItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: GModMenuItem | undefined): vscode.ProviderResult<GModMenuItem[]> {
        if (this.addonInfo == undefined)
            return Promise.resolve([]);

        if (!element) {
            return Promise.resolve([
                new GModMenuItem("addoninfo", "Addon Information", "", undefined, vscode.TreeItemCollapsibleState.Expanded),
                new GModMenuItem("weapons", "Weapons", "", "folder.svg", vscode.TreeItemCollapsibleState.Collapsed),
                new GModMenuItem("entities", "Entities", "", "folder.svg", vscode.TreeItemCollapsibleState.Collapsed)
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
    }
}

class GModMenuItem extends vscode.TreeItem {
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
    }

    get tooltip(): string {
        return `${this.label}-${this.value}`;
    }

    get description(): string {
        return this.value;
    }
}
