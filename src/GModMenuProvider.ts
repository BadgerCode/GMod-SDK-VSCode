import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class GModMenuProvider implements vscode.TreeDataProvider<GModMenuItem> {

    constructor(private workspaceRoot: string | undefined) { }


    getTreeItem(element: GModMenuItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: GModMenuItem | undefined): vscode.ProviderResult<GModMenuItem[]> {
        return Promise.resolve([]);
    }
}

class GModMenuItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    get tooltip(): string {
        return `${this.label}-${this.version}`;
    }

    get description(): string {
        return this.version;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };
}
