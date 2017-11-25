/**
 *  © olback 2017
 *      BAR
 */

const vscode = require('vscode');
const exec = require('child_process').exec;

const commands = {
    build: "make build",
    run: "./rdg"
}
let runAfterBuild = false;
const statusBarItem_sep_1 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const statusBarItem_build = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const statusBarItem_run = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const statusBarItem_bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
const statusBarItem_sep_2 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

function init() {
    statusBarItem_sep_1.text = "|";
    statusBarItem_sep_1.show();

    statusBarItem_build.text = "Build";
    statusBarItem_build.command = "extension.build";
    statusBarItem_build.show();

    statusBarItem_run.text = "► Run";
    statusBarItem_run.command = "extension.run";
    statusBarItem_run.show();

    statusBarItem_bar.text = "Build and run";
    statusBarItem_bar.command = "extension.bar";
    statusBarItem_bar.show();

    statusBarItem_sep_2.text = "|";
    statusBarItem_sep_2.show();

}

function build() {
    vscode.window.showInformationMessage('Building project...');
    let ls = exec(commands.build, {cwd: vscode.workspace.rootPath, maxBuffer: 2048000});

    ls.on('close', (code) => {
        //console.log(`child process exited with code ${code}`);
        if(code == 0) {
            vscode.window.showInformationMessage('Build complete.');
            if(runAfterBuild) {
                runAfterBuild = false; // reset 
                run(); // run
            }
        } else {
            vscode.window.showErrorMessage('Build failed.');
            ls.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });
        }
    });
}

function run() {
    vscode.window.showInformationMessage('Running project...');
    exec(commands.run, {cwd: vscode.workspace.rootPath, maxBuffer: 2048000});
}

// this method is called when your extension is executed
function activate(context) {

    console.log('bar is active!');

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
        runAfterBuild = true;
        build();
    });
    context.subscriptions.push(disposable);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    console.log('bar unloaded');
}
exports.deactivate = deactivate;
