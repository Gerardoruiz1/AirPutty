const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let sshProcess;
let inputRequired = false;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Start the SSH process with spawn
ipcMain.on('run-ssh-command', (event) => {
    sshProcess = spawn('ssh', ['estudiante@rumad.uprm.edu'], {
        stdio: ['pipe', 'pipe', 'pipe'],
    });

    sshProcess.stdout.on('data', (data) => {
        inputRequired = false;
        event.reply('command-output', `nice ${data.toString()}`);
    });

    sshProcess.stderr.on('data', (data) => {
        inputRequired = false;
        event.reply('command-output', `error ${data.toString()}`);
    });``

    sshProcess.on('close', (code) => {
        event.reply('command-output', `Process exited with code ${code}`);
    });

    // If no output is received within a short time, assume input is required
    setTimeout(() => {
        if (inputRequired) {
            event.reply('command-output', 'Input required (e.g., password): ');
        }
    }, 1); // Adjust the timeout as needed
});

// Send user input to the SSH process
ipcMain.on('send-input', (event, input) => {
    if (sshProcess) {
        sshProcess.stdin.write(input + '\n'); // Send input followed by newline
        inputRequired = true; // Assume that input is required again
    }
});
