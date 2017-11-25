//import { Extension } from 'typescript';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('car is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    // Build
    let disposable = vscode.commands.registerCommand('extension.build', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Building whatever');
    });
    context.subscriptions.push(disposable);

    // Run
    disposable = vscode.commands.registerCommand('extension.run', () => {
        vscode.window.showInformationMessage('Started whatever');
    });
    context.subscriptions.push(disposable);

    // Build and run
    disposable = vscode.commands.registerCommand('extension.bar', () => {
        vscode.window.showInformationMessage('Started and run whatever');
    });
    context.subscriptions.push(disposable);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    console.log('car unloaded');
}
exports.deactivate = deactivate;