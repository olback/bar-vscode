/**
 *  © olback 2017
 *      BAR
 */

// Imports
const vscode = require('vscode');
const exec = require('child_process').exec;
const fs = require('fs');

let config;
let statusbar = 0;
let resetConfig_val = 0;
let runAfterBuild = false;
let new_build_command;
let new_run_command;
const statusBarItems = [];
const configPath = vscode.workspace.rootPath + '/.vscode/bar.conf.json';
const output = vscode.window.createOutputChannel('Bar');
const terminal = vscode.window.createTerminal('Bar');

function addStatusBarItem(str, cmd, tip, col) { // (name, command, tooltip, color)
    statusBarItems.push(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left));
    statusBarItems[statusBarItems.length-1].text = str;
    if(cmd) statusBarItems[statusBarItems.length-1].command = cmd;
    if(tip) statusBarItems[statusBarItems.length-1].tooltip = tip;
    if(col) statusBarItems[statusBarItems.length-1].color = col;
    statusBarItems[statusBarItems.length-1].show();
}

function addStatusBar() {
    addStatusBarItem("|");
    addStatusBarItem("Build", "bar.build", "Build project");
    addStatusBarItem("► Run", "bar.run", "Run project/file");
    addStatusBarItem("Build and run", "bar.bar", "Build and run project/file");
    addStatusBarItem("|");
}

function newConfigBuild() {
    if(resetConfig_val == 0) {
        vscode.window.showInformationMessage('Add Bar config?', 'Yes')
            .then(selection => {
            if(selection == "Yes") {
                vscode.window.showInputBox({prompt: 'Command to build the project. Example: "make build"', ignoreFocusOut: true})
                .then(val => { new_build_command = val; newConfigRun(); });
            }
        });
    } else {
        vscode.window.showInputBox({prompt: 'Command to build the project. Example: "make build"', ignoreFocusOut: true})
        .then(val => { new_build_command = val; newConfigRun(); });
    }
}

function newConfigRun() {
    vscode.window.showInputBox({prompt: "Command to run your project. Example: \"./your-executable-file\"", ignoreFocusOut: true})
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
            resetConfig_val = 1;
            init();
        }
    }
    });
}

function init() {
    readConfig();
}

function build() {
    //vscode.window.showInformationMessage('Building project...');
    let ls = exec(config.commands.build, {cwd: vscode.workspace.rootPath, maxBuffer: 2048000});

    ls.on('close', (code) => {
        //console.log(`child process exited with code ${code}`);
        if(code == 0) {
            vscode.window.showInformationMessage('Build complete.');
            //output.hide(vscode.ViewColumn.Two);
            if(runAfterBuild) {
                runAfterBuild = false; // reset 
                run(); // run
            }
        } else {
            vscode.window.showErrorMessage('Build failed. Check Bar Output.');
        }
    });
    ls.stderr.on('data', (data) => {
        //console.log(`stderr: ${data}`);
        output.show();
        output.appendLine(data);
    });
}

function run() {
    vscode.window.showInformationMessage('Running project...');
    //exec(config.commands.run, {cwd: vscode.workspace.rootPath, maxBuffer: 2048000});
    terminal.show();
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

    // Init
    let disposable = vscode.commands.registerCommand('bar.init', () => {
        init();
    });
    context.subscriptions.push(disposable);

    // Reload alias for bar.init
    disposable = vscode.commands.registerCommand('bar.reload', () => {
        init();
    });
    context.subscriptions.push(disposable);

    // Build
    disposable = vscode.commands.registerCommand('bar.build', () => {
        build();
    });
    context.subscriptions.push(disposable);

    // Run
    disposable = vscode.commands.registerCommand('bar.run', () => {
        run();
    });
    context.subscriptions.push(disposable);

    // Build and run
    disposable = vscode.commands.registerCommand('bar.bar', () => {
        //vscode.window.showInformationMessage('Started and run whatever');
        runAfterBuild = true;
        build();
    });
    context.subscriptions.push(disposable);

    // Reset config
    disposable = vscode.commands.registerCommand('bar.reset', () => {
        resetConfig();
    });
    context.subscriptions.push(disposable);

    // Edit config
    disposable = vscode.commands.registerCommand('bar.config', () => {
        editConfig();
    });
    context.subscriptions.push(disposable);

    if(fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        if(statusbar == 0) {
            addStatusBar();
            statusbar = 1;
        }
    }

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    //console.log('bar unloaded');
}
exports.deactivate = deactivate;
