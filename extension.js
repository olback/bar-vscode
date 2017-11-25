//import { Extension } from 'typescript';

const vscode = require('vscode');

const statusBarItem_build = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
const statusBarItem_run = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
const statusBarItem_bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)

function init() {
    statusBarItem_build.text = "Build";
    statusBarItem_build.show();

    statusBarItem_run.text = "Run";
    statusBarItem_run.show();

    statusBarItem_bar.text = "Build and run";
    statusBarItem_bar.show();

}

function build() {
    vscode.window.showInformationMessage('Building project...');
}

function run() {
    vscode.window.showInformationMessage('Running project...');
}

// this method is called when your extension is executed
function activate(context) {

    console.log('car is now active!');
    //console.log("VS Code : ",vscode.window);

    // Init
    let disposable = vscode.commands.registerCommand('extension.init', () => {
        init();
    });
    context.subscriptions.push(disposable);

    // Build
    disposable = vscode.commands.registerCommand('extension.build', () => {
        build();
    });
    context.subscriptions.push(disposable);

    // Run
    disposable = vscode.commands.registerCommand('extension.run', () => {
        run();
    });
    context.subscriptions.push(disposable);

    // Build and run
    disposable = vscode.commands.registerCommand('extension.bar', () => {
        //vscode.window.showInformationMessage('Started and run whatever');
        build();
        run();
    });
    context.subscriptions.push(disposable);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    console.log('car unloaded');
}
exports.deactivate = deactivate;
