const { ipcRenderer } = require('electron');

// Run the SSH command when the button is clicked
document.getElementById('run-ssh').addEventListener('click', () => {
    ipcRenderer.send('run-ssh-command');
});

// Send user input to the SSH process
document.getElementById('send-input').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    ipcRenderer.send('send-input', userInput);
    document.getElementById('user-input').value = ''; // Clear the input field after sending
});

// Display the command output
ipcRenderer.on('command-output', (event, output) => {
    const outputElement = document.getElementById('output');
    outputElement.textContent += output;  // Append the new output
});
