import * as vscode from 'vscode';
import * as path from 'path';
import { GModWorkshopManager } from './GModWorkshopManager';

export class GModWorkshopView implements vscode.TreeDataProvider<GModWorkshopMenuItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<GModWorkshopMenuItem | undefined> = new vscode.EventEmitter<GModWorkshopMenuItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GModWorkshopMenuItem | undefined> = this._onDidChangeTreeData.event;

    private workshopItems: any[] = [];

    constructor(private workshopManager: GModWorkshopManager) {
        this.refresh();
    }

    getTreeItem(element: GModWorkshopMenuItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: GModWorkshopMenuItem): Thenable<GModWorkshopMenuItem[]> {
        return Promise.resolve(this.workshopItems
            .map(item => new GModWorkshopMenuItem(item["publishedfileid"], item["title"]))
        );
    }

    refresh(): void {
        // TODO: get steam ID from config
        this.workshopManager.getAddonsForUser("76561198021181972")
            .then(response => {
                this.workshopItems = response;
                this._onDidChangeTreeData.fire(undefined);
            });
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
        return this.contextValue || "";
    }
}
