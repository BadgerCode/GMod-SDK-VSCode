import * as vscode from 'vscode';
import * as path from 'path';

export class GModWorkshopView implements vscode.TreeDataProvider<GModWorkshopMenuItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<GModWorkshopMenuItem | undefined> = new vscode.EventEmitter<GModWorkshopMenuItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GModWorkshopMenuItem | undefined> = this._onDidChangeTreeData.event;

    constructor() { }

    getTreeItem(element: GModWorkshopMenuItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: GModWorkshopMenuItem): Thenable<GModWorkshopMenuItem[]> {
        return Promise.resolve([]);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}

export class GModWorkshopMenuItem extends vscode.TreeItem {
    constructor(id: string,
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
        return this.label || "";
    }
}
