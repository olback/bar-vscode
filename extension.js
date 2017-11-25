/**
 *  © olback 2017
 *      BAR
 */

// Imports
const vscode = require('vscode');
const exec = require('child_process').exec;
const fs = require('fs');

let config;
let runAfterBuild = false;
let new_build_command;
let new_run_command;
const statusBarItems = [];
const configPath = vscode.workspace.rootPath + "/.vscode/bar.conf.json";

function addStatusBarItem(str, cmd) {
    statusBarItems.push(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left));
    statusBarItems[statusBarItems.length-1].text = str;
    if(cmd) { statusBarItems[statusBarItems.length-1].command = cmd; }
    statusBarItems[statusBarItems.length-1].show();
}

function addStatusBar() {
    addStatusBarItem("|");
    addStatusBarItem("Build", "extension.build");
    addStatusBarItem("► Run", "extension.run");
    addStatusBarItem("Build and run", "extension.bar");
    addStatusBarItem("|");
}

function newConfigBuild() {
    vscode.window.showInputBox({prompt: 'Build command. Example: "make build"', ignoreFocusOut: true})
        .then(val => { new_build_command = val; newConfigRun(); });
}

function newConfigRun() {
    vscode.window.showInputBox({prompt: "Run command. Example: \"./your-executable-file\"", ignoreFocusOut: true})
        .then(val => { new_run_command = val; writeConfig(); });
}

function writeConfig() {
    console.log('Creating new config: ', configPath);
    if(!fs.existsSync(vscode.workspace.rootPath + '/.vscode')) {
        fs.mkdirSync(vscode.workspace.rootPath + '/.vscode');
    }

    let newConfig = {}
    newConfig.commands = {}
    newConfig.commands.build = new_build_command;
    newConfig.commands.run = new_run_command;

    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4));
    readConfig();
    vscode.window.showInformationMessage('Bar done! Saved settings to ' + configPath);
}

function readConfig() {
    if(fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        addStatusBar();
    } else {
        newConfigBuild();
    }
}

function init() {
    console.log('bar is active!');
    readConfig();
}

function build() {
    //vscode.window.showInformationMessage('Building project...');
    let ls = exec(config.commands.build, {cwd: vscode.workspace.rootPath, maxBuffer: 2048000});

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
    exec(config.commands.run, {cwd: vscode.workspace.rootPath, maxBuffer: 2048000});
}

// this method is called when your extension is executed
function activate(context) {

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
    //console.log('bar unloaded');
}
exports.deactivate = deactivate;
