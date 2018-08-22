'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const ex = 'bar';

let output: vscode.OutputChannel;
let terminal: vscode.Terminal;
let config: any;
const statusBarItems: Array<vscode.StatusBarItem> = [];

function load(): void {
    // Do all the setup stuff

    if (vscode.workspace.workspaceFolders === undefined) {
        return;
    }

    // config = JSON.parse(fs.readFileSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'bar.conf.json'), 'utf8'));
    try {

        config = JSON.parse(fs.readFileSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'bar.conf.json'), 'utf8'));

    } catch (e) {

        vscode.window.showErrorMessage(`Bar config reload failed: ${e}`);

    }

    output = vscode.window.createOutputChannel('Bar');
    terminal = vscode.window.createTerminal('Bar');

    addStatusBarItem("$(package)  Build", "bar.build", "Build project");
    addStatusBarItem("$(terminal)  Run", "bar.run", "Run project/file");
    addStatusBarItem("$(rocket)  Bar", "bar.bar", "Build and run project/file");
}

function addStatusBarItem(str: string, cmd?: string, tip?: string, col?: string) { // (name, command, tooltip, color)
    statusBarItems.push(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left));
    statusBarItems[statusBarItems.length-1].text = str;
    if (cmd) {
        statusBarItems[statusBarItems.length-1].command = cmd;
    }
    if (tip) {
        statusBarItems[statusBarItems.length-1].tooltip = tip;
    }
    if (col) {
        statusBarItems[statusBarItems.length-1].color = col;
    }
    statusBarItems[statusBarItems.length-1].show();
}

export function activate(context: vscode.ExtensionContext): void {

    context.subscriptions.push(
        vscode.commands.registerCommand(`${ex}.init`, () => {

            if (vscode.workspace.workspaceFolders === undefined) {
                return vscode.window.showErrorMessage('Bar requires a workspace.');
            }

            if (!fs.existsSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode'))) {
                fs.mkdirSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode'));
            }

            if (!fs.existsSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'bar.conf.json'))) {
                fs.writeFileSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'bar.conf.json'), JSON.stringify({
                    commands: {
                        build: 'echo "build command"',
                        run: 'echo "run command"',
                    }
                }, null, 4) + '\n', 'utf8');
            }

            vscode.window.showTextDocument(vscode.Uri.file(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'bar.conf.json')));

            if (statusBarItems.length === 0) {
                load();
            }

        }),
        vscode.commands.registerCommand(`${ex}.build`, () => {
            output.appendLine(`[Info] Building with command ${config.commands.build}`);
            terminal.show();
            terminal.sendText('\x03'); // https://stackoverflow.com/questions/5774689/what-is-003-special-for
            terminal.sendText(config.commands.build);
        }),
        vscode.commands.registerCommand(`${ex}.run`, () => {
            output.appendLine(`[Info] Building with command ${config.commands.run}`);
            terminal.show();
            terminal.sendText('\x03');
            terminal.sendText(config.commands.run);
        }),
        vscode.commands.registerCommand(`${ex}.bar`, () => {
            console.log('wip');
        }),
    );

    if (vscode.workspace.workspaceFolders && fs.existsSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'bar.conf.json'))) {

        load();

        // const w = fs.watch(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'bar.conf.json'), 'utf8');
        // w.addListener('change', () => {

        //     if (vscode.workspace.workspaceFolders) {

        //         try {

        //             config = JSON.parse(fs.readFileSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'bar.conf.json'), 'utf8'));
        //             vscode.window.showInformationMessage('<<<<Bar config reloaded');

        //         } catch (e) {

        //             vscode.window.showErrorMessage(`<<<<Bar config reload failed: ${e}`);

        //         }

        //     }

        // });

    }

    console.log('bar is now active!');

}

// this method is called when your extension is deactivated
export function deactivate() {
}
