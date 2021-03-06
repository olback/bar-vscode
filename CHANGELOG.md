# Change Log

#  0.2.0
* Thanks to @nathan815 for cleaning up my mess.
* Added ability to disable messages.

## 0.1.1
* Fixed config-write bug

## 0.1.0
* Use `vscode.workspace.worspaceFolders[0].uri.fsPath` instead of `vscode.workspace.rootPath`.

## 0.0.9
* Send CTRL-C to terminal before sending command. Thanks @agurz.

## 0.0.8
* Clear output before running the build command.

## 0.0.7
* Cleaned up some of the code.
* Added icons to the status bar items.
* 'Build and run' is now shortend to 'Bar'.

## 0.0.6
* Fixed 'Add new config?' bug.

## 0.0.5
* Run commands are now run from the integrated terminal. Output will also be shown here.
* Added `Bar: Reload`. Alias for `Bar: Init`.

## 0.0.4
* Added keyboard shortcut to build and run: `shift+f6`.
* Added keyboard shortcut to build: `ctrl+shift+f6`.
* Added keyboard shortcut to run: `shift+f2`.
* Added `Bar: Edit config` command.

## 0.0.3
* When the build fails, show the output in Bar Output.
* Ask before creating bar.conf.json
* Auto load the extension if `.vscode/bar.conf.json` exists.
* Can't initialize the extension more than once. (bug fix)
* Minor improvements.
* Added MIT License.
* Added more info in `package.json`.
* Added more bugs.

## 0.0.2
* Updated README.md.
* Added `Bar: Reset` command.

## 0.0.1
* Initial release of Bar!
