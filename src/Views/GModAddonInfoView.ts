import * as vscode from 'vscode';
import * as path from 'path';
import { GModAddonManager, GModAddonInfo } from '../Services/GModAddonManager';

export class GModAddonInfoView implements vscode.TreeDataProvider<GModMenuItem> {
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
                new GModMenuItem("title", "Title", this.addonInfo.title),
                new GModMenuItem("description", "Description", this.addonInfo.description),
                new GModMenuItem("type", "Type", this.addonInfo.type),
                new GModMenuItem("tags", "Tags", this.addonInfo.tags.join(", ")),
                new GModMenuItem("ignoredFiles", "Ignored files", "", undefined, vscode.TreeItemCollapsibleState.Collapsed)
            ]);
        }
        else if (element.id == "ignoredFiles") {
            return Promise.resolve(
                this.addonInfo.ignore.map((filePath, index) => new GModMenuItem(`ignoredFiles.${index}`, filePath, ""))
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

        this.tooltip = this.value;
        this.description = this.value;
    }
}
