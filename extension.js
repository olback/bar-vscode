/**
 *  © olback 2017
 *      BAR
 */

// Imports
const vscode = require('vscode');
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');

const DEFAULT_CONFIG = {
    commands: {
        build: "",
        run: ""
    },
    messages: {
        building: true,
        buildSuccess: true,
        buildError: true,
        buildErrorMessageBox: true,
        run: true
    }
};

const STATUS_MESSAGE_DURATION = 2000;

let config = DEFAULT_CONFIG;
let statusbar = 0;
let resetConfigVal = 0;
let newBuildCommand;
let newRunCommand;
const statusBarItems = {};
const configPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode', 'bar.conf.json');
const output = vscode.window.createOutputChannel('Bar');
const terminal = vscode.window.createTerminal('Bar');

function addStatusBarItem(key, name, cmd, tip, col) { // (key, name, command, tooltip, color)
    const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    if(name) item.text = name;
    if(cmd) item.command = cmd;
    if(tip) item.tooltip = tip;
    if(col) item.color = col;
    item.show();
    statusBarItems[key] = item;
    return item;
}

let statusMessageTimeout;
function showStatusMessage(str, duration = STATUS_MESSAGE_DURATION) {
    clearTimeout(statusMessageTimeout);
    statusBarItems.statusMessage.text = str;
    statusBarItems.statusMessage.show();
    if(duration) {
        statusMessageTimeout = setTimeout(() => {
            statusBarItems.statusMessage.hide();
        }, duration);
    }
}

function addStatusBar() {
    addStatusBarItem("divider1", "|");
    addStatusBarItem("build", "$(package)  Build", "bar.build", "Build project");
    addStatusBarItem("run", "$(terminal)  Run", "bar.run", "Run project/file");
    addStatusBarItem("bar", "$(rocket)  Bar", "bar.bar", "Build and run project/file");
    addStatusBarItem("divider2", "|");
    addStatusBarItem("statusMessage");
}

function newConfigBuild() {
    if(resetConfigVal == 0) {
        vscode.window.showInformationMessage('Add Bar config?', 'Yes')
        .then(selection => {
            if(selection == "Yes") {
                vscode.window.showInputBox({prompt: 'Command to build the project. Example: "make build"', ignoreFocusOut: true})
                .then(val => { newBuildCommand = val; newConfigRun(); });
            }
        });
    } else {
        vscode.window.showInputBox({prompt: 'Command to build the project. Example: "make build"', ignoreFocusOut: true})
        .then(val => { newBuildCommand = val; newConfigRun(); });
    }
}

function newConfigRun() {
    vscode.window.showInputBox({prompt: "Command to run your project. Example: \"./your-executable-file\"", ignoreFocusOut: true})
        .then(val => { newRunCommand = val; writeConfig(); });
}

function writeConfig() {
    console.log('Creating new config: ', configPath);
    if (!fs.existsSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode'))) {
        fs.mkdirSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '.vscode'))
    }

    const newConfig = { ...DEFAULT_CONFIG };
    newConfig.commands.build = newBuildCommand;
    newConfig.commands.run = newRunCommand;

    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 4));
    readConfig();
    vscode.window.showInformationMessage('Bar done! Saved settings to ' + configPath);
}

function readConfig() {
    if(fs.existsSync(configPath)) {
        const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        config = Object.assign({}, DEFAULT_CONFIG, userConfig);
        if(statusbar == 0) {
            addStatusBar();
            statusbar = 1;
        }
    } else {
        newConfigBuild();
    }
}

function resetConfig() {
    vscode.window.showWarningMessage('Reset Bar config?', 'Yes').then(selection => {
      if(selection == "Yes") {
        if(fs.existsSync(configPath)) {
            fs.unlinkSync(configPath, (err) => {
                if(err) return console.log(err);
                console.log("Removed " + configPath);
            });
            resetConfigVal = 1;
            init();
        }
    }
    });
}

function init() {
    readConfig();
}

function build() {
    return new Promise((resolve) => {
        output.clear();
        if(config.messages.building) {
            showStatusMessage('Building...', 0);
        }

        let ls = exec(config.commands.build, {
            cwd: vscode.workspace.workspaceFolders[0].uri.fsPath, 
            maxBuffer: 2048000
        });

        ls.on('close', (code) => {
            //console.log(`child process exited with code ${code}`);
            statusBarItems.statusMessage.hide();
            if(code == 0) {
                resolve();
                if(config.messages.buildSuccess) {
                    showStatusMessage('Build Successful');
                }
            } else {
                if(config.messages.buildError) {
                    showStatusMessage('Build Failed');
                }
                if(config.messages.buildErrorMessageBox) {
                    vscode.window.showErrorMessage('Build Failed. Check Bar Output.');
                }
            }
        });

        ls.stderr.on('data', (data) => {
            //console.log(`stderr: ${data}`);
            output.show();
            output.appendLine(data);
        });
    });
}

function run() {
    if(config.messages.run) {
        showStatusMessage('Running');
    }
    //exec(config.commands.run, {cwd: vscode.workspace.workFolders[0].uri.fsPath, maxBuffer: 2048000});
    terminal.show();
    terminal.sendText('\003'); // Ctrl+C https://stackoverflow.com/questions/5774689/what-is-003-special-for
    terminal.sendText(config.commands.run);
}

function editConfig() {
    let openPath = vscode.Uri.file(configPath);
    vscode.workspace.openTextDocument(openPath).then(doc => {
      vscode.window.showTextDocument(doc);
    });
}

// this method is called when your extension is executed
function activate(context) {

    console.log('bar is active!');

    // Build and run
    let disposable = vscode.commands.registerCommand('bar.bar', () => {
        build().then(run);
    });
    context.subscriptions.push(disposable);

    context.subscriptions.push(
        vscode.commands.registerCommand('bar.init', init),
        vscode.commands.registerCommand('bar.reload', init),
        vscode.commands.registerCommand('bar.build', build),
        vscode.commands.registerCommand('bar.run', run),
        vscode.commands.registerCommand('bar.reset', resetConfig),
        vscode.commands.registerCommand('bar.config', editConfig)
    );

    readConfig();

}

// this method is called when your extension is deactivated
function deactivate() {
    //console.log('bar unloaded');
}

exports.activate = activate;
exports.deactivate = deactivate;
