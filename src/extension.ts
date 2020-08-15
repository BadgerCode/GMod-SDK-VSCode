import * as vscode from 'vscode';
import { GModMenuProvider } from './GModMenuProvider';


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "gmod-sdk" is now active!');

	const gmodMenuProvider = new GModMenuProvider(vscode.workspace.rootPath);
	vscode.window.registerTreeDataProvider('gmodMenuSideBar', gmodMenuProvider);
}


export function deactivate() { }
