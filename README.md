# Bar - VS Code

![Downloads](https://img.shields.io/vscode-marketplace/d/olback.bar.svg)

## Features
The goal with this extension is to make it easier to develop binary files. In the status bar you have the option to Build, Run and "Build and run" the project.

![status bar buttons](https://raw.githubusercontent.com/olback/bar-vscode/master/images/status_bar.png)  

## Extension Commands
* `Bar: Init`: Initialize the extension.
* `Bar: Reload`: Alias for `Bar: Init`.
* `Bar: Build`: Build your project.
* `Bar: Run`: Run your project.
* `Bar: Build and run project`: Build and run project.
* `Bar: Reset` Reset the config file.
* `Bar: Edit config` Open the config file.

## Extension Keybindings
* Build and run: `shift+f6`
* Build: `ctrl+shift+f6`
* Run: `shift+f2`

## Configuration
Open the command pallete (Cmd or Ctrl+Shift+P) and run `Bar: Init` to initialize Bar and create the config file.

The commands for building/compiling and running your project are saved in `projectRoot/.vscode/bar.conf.json`.

```
{
    "commands": {
        "build": "your-build-command",
        "run": "./project-exe"
    },
    "messages": {
        "building": true,
        "buildSuccess": true,
        "buildError": true,            
        "buildErrorMessageBox": true, 
        "run": true
    }
}
```

The values in the "messages" object allow you to control the kinds of status messages that will be shown. When `buildErrorMessageBox` is true, a small informational error box will also appear in the bottom right corner when the build fails.

## Bugs
Please report any bugs or issues on [GitHub](https://github.com/olback/bar-vscode)

**Enjoy!**
