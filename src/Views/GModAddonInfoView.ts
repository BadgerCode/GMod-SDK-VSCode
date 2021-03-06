import * as vscode from 'vscode';
import * as path from 'path';
import { GModAddonManager, GModAddonInfo, AddonTag, AddonType } from '../Services/GModAddonManager';

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
            var typeDescription = this.isAddonTypeValid(this.addonInfo.type) ? this.addonInfo.type : "❌ INVALID TYPE";
            var tagsDescription = this.areTagsValid(this.addonInfo.tags)
                ? (this.addonInfo.tags.length <= 2 ? this.addonInfo.tags.join(", ") : "❌ TOO MANY TAGS")
                : "❌ INVALID TAGS";

            return Promise.resolve([
                new GModMenuItem("title", "Title", this.addonInfo.title),
                new GModMenuItem("description", "Description", this.addonInfo.description),
                new GModMenuItem("type", "Type", typeDescription),
                new GModMenuItem("tags", "Tags", tagsDescription),
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

    private isAddonTypeValid(type: AddonType): boolean {
        return Object.values(AddonType).includes(type);
    }

    private areTagsValid(tags: AddonTag[]): boolean {
        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            if (Object.values(AddonTag).includes(tag) == false)
                return false;
        }
        return true;
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
