# Project Color

Automatically affect a window color for each project (workspace).

The color will be stored and editable in `.vscode/color.json`.  
Sadly, the `.vscode/settings.json` file will be updated automatically while changing the color because vscode doesn't allow to change settings "on the fly".
See [this issue](https://github.com/microsoft/vscode/issues/40233) to know when a local settings file will be available.

I recommend that you enable this extension only on a workspace basis, to avoid having unwanted colors and files appear on projects.

## Installation

To install, please load manually the last `.vsix` file from `releases/`.
There is no plan to put this extension to the marketplace for now.

## Usage

It is recommended to add a line containing this in your global gitignore file.
```
.vscode/color.json
```
