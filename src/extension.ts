import * as vscode from "vscode";
import { getNonce } from "./getNonce";

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  let disposable = vscode.commands.registerCommand("vsreddit.vsreddit", () => {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (currentPanel) {
      // Show if panel exists
      currentPanel.reveal(columnToShowIn);
    }
    else {
      currentPanel = vscode.window.createWebviewPanel(
        'vsreddit', 
        'VS Reddit', // Panel title
        vscode.ViewColumn.Beside, 
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );
      currentPanel.webview.html = getWebviewContent(context, currentPanel);

      // Reset when the current panel is closed
      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }

function getWebviewContent(context: vscode.ExtensionContext, panel: vscode.WebviewPanel) {
  let config = vscode.workspace.getConfiguration('vsreddit');

  const styleResetUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "media", "reset.css")
  );

  const styleVSCodeUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "media", "vscode.css")
  );

  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "out", "compiled/vsreddit.js")
  );

  const styleMainUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "out", "compiled/vsreddit.css")
  );

  // Use a nonce to only allow a specific script to be run.
  const nonce = getNonce();

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
        panel.webview.cspSource
      }; script-src 'nonce-${nonce}';">      
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${styleResetUri}" rel="stylesheet">
      <link href="${styleVSCodeUri}" rel="stylesheet">
      <link href="${styleMainUri}" rel="stylesheet">
    </head>
    <body>
      <input id="darkMode" class="${config.get("darkMode")}"/>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
}