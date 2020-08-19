import * as vscode from 'vscode';
import * as path from 'path';
import { GModWorkshopManager } from './GModWorkshopManager';

export class GModWorkshopView implements vscode.TreeDataProvider<GModWorkshopMenuItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<GModWorkshopMenuItem | undefined> = new vscode.EventEmitter<GModWorkshopMenuItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GModWorkshopMenuItem | undefined> = this._onDidChangeTreeData.event;

    private workshopItems: any[] = [];
    private steamID: string | undefined = undefined;
    private isLoading: boolean = false;

    constructor(private workshopManager: GModWorkshopManager) {
        this.refresh();
    }

    getTreeItem(element: GModWorkshopMenuItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: GModWorkshopMenuItem): Thenable<GModWorkshopMenuItem[]> {
        if (this.steamID == undefined) {
            return Promise.resolve([]);
        }

        if (this.isLoading) {
            return Promise.resolve([
                new GModWorkshopMenuItem("loading", "Loading...")
            ]);
        }

        if (this.workshopItems.length == 0) {
            return Promise.resolve([
                new GModWorkshopMenuItem("no-items", "You don't have any workshop items")
            ]);
        }

        return Promise.resolve(this.workshopItems
            .map(item => new GModWorkshopMenuItem(`item-${item["publishedfileid"]}`, item["title"], item["publishedfileid"]))
        );
    }

    refresh(): void {
        this.steamID = this.getSteamID();

        if (this.steamID == undefined) {
            this.workshopItems = [];
            this._onDidChangeTreeData.fire(undefined);
            return;
        }

        this.isLoading = true;
        this.workshopManager.getAddonsForUser(this.steamID)
            .then(response => {
                this.isLoading = false;
                this.workshopItems = response;
                this._onDidChangeTreeData.fire(undefined);
            });
    }

    private getSteamID(): string | undefined {
        var config = vscode.workspace.getConfiguration('gmod-sdk').get<string>("steamID");

        if (config == undefined || config.length == 0)
            return undefined;

        return config
    }
}

export class GModWorkshopMenuItem extends vscode.TreeItem {
    constructor(id: string,
        label: string,
        description: string | undefined = undefined,
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

        this.tooltip = label;
        this.description = description;
    }
}
