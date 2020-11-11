import * as vscode from "vscode";
import * as fs from "fs";
import * as JSON5 from "json5";

const VSCODE_DIR = `${vscode.workspace.rootPath}/.vscode`;
const COLOR_FILE = `${VSCODE_DIR}/color.json`;

export function parseColorFile(fileContent: string): string | null {
  try {
    if (fileContent === "") {
      return null;
    }

    const colorObj = JSON5.parse(fileContent);

    if (!colorObj || typeof colorObj !== "object" || !colorObj.color) {
      return null;
    }
    return colorObj.color;
  } catch (err) {
    return null;
  }
}

async function readAndApplyColor(): Promise<boolean> {
  if (!fs.existsSync(COLOR_FILE)) {
    console.warn(`Could not find file: ${COLOR_FILE}. Skipping...`);
    return false;
  }

  try {
    const buffer = fs.readFileSync(COLOR_FILE, { encoding: "utf8" });
    const color = parseColorFile(buffer.toString());

    if (!color) {
      return false;
    }

    const customizationKey = "workbench.colorCustomizations";
    const customizations = {
      "activityBar.background": color,
      "statusBar.background": color
    };

    const workspaceConf = vscode.workspace.getConfiguration();

    const currentCustomizations = workspaceConf.get(customizationKey);
    if (
      JSON.stringify(currentCustomizations) !== JSON.stringify(customizations)
    ) {
      workspaceConf.update(customizationKey, customizations, vscode.ConfigurationTarget.Workspace);
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function createColorFile(color: string) {
  if (!fs.existsSync(VSCODE_DIR)) {
    fs.mkdirSync(VSCODE_DIR, { recursive: true });
  }

  fs.writeFileSync(COLOR_FILE, JSON.stringify({ color: color }));
}

function openColorFileInCode() {
  vscode.workspace.openTextDocument(COLOR_FILE).then(doc => {
    vscode.window.showTextDocument(doc);
  });
}

async function updateColor() {
  const success = await readAndApplyColor();
  if (!success) {
    createColorFile(getRandomDarkColor());
    openColorFileInCode();
  }
}

function getRandomDarkColor() {
  return "#" + ((Math.random() * 0x555555) << 0).toString(16);
}

export async function activate(context: vscode.ExtensionContext) {
  const watcher = vscode.workspace.createFileSystemWatcher(COLOR_FILE);
  updateColor();
  watcher.onDidCreate(updateColor);
  watcher.onDidChange(updateColor);
  watcher.onDidDelete(updateColor);
}
