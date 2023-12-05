import * as vscode from 'vscode';
import { run } from "./index";
export function activate(context: vscode.ExtensionContext) {
	// 注册一个命令
	let disposable = vscode.commands.registerCommand('codeStat.countCurFile', function (uri,a,c) {
		if (uri) {
			run(uri);
		} else {
			vscode.window.showInformationMessage(`你选错了`);
		}
	});
	context.subscriptions.push(disposable);   // 插件退出时释放资源
}

export function deactivate() { }
