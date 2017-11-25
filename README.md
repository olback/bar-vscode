# Bar - VS Code

## Features
The goal with this extension is to make it easier to develop binary files. In the status bar you have the option to Build, Run and "Build and run" the project.  
![staus bar buttons](images/status_bar.png)  
The commands for building/compiling and running your project are saved in `projectRoot/.vscode/bar.conf.json` and should look like this:
```
{
    "commands":{
        "build":"your-build-command",
        "run":"./project-exe"
    }
}
```

## Extension Commands
* `Bar: Init`: Initialize the extension.
* `Bar: Build`: Build your project.
* `Bar: Run`: Run your project.
* `Bar: Build and run project`: Build and run project.
* `Bar: Reset` Reset the config file.

### 0.0.2
Updated README.md  
Added `Bar: Reset` command.

### 0.0.1
Initial release of Bar!

**Enjoy!**