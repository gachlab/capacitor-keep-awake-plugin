import { KeepAwake } from '@gachlab/capacitor-keep-awake-plugin';

let isKeepAwakeEnabled = false;

function addLog(message) {
    const log = document.getElementById('log');
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.textContent = `[${timestamp}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function updateStatus() {
    const status = document.getElementById('status');
    const toggle = document.getElementById('toggle');
    status.textContent = isKeepAwakeEnabled ? 'Sleep Prevention: ON' : 'Sleep Prevention: OFF';
    toggle.textContent = isKeepAwakeEnabled ? 'Turn OFF' : 'Turn ON';
    status.style.background = isKeepAwakeEnabled ? '#d4edda' : '#f8d7da';
}

window.toggleKeepAwake = async () => {
    try {
        if (isKeepAwakeEnabled) {
            const result = await KeepAwake.allowSleep();
            addLog(`Allow sleep called - isAllowdSleep: ${result.isAllowdSleep}`);
            isKeepAwakeEnabled = false;
        } else {
            const result = await KeepAwake.dontAllowSleep();
            addLog(`Prevent sleep called - isAllowdSleep: ${result.isAllowdSleep}`);
            isKeepAwakeEnabled = true;
        }
        updateStatus();
    } catch (error) {
        addLog(`Error: ${error.message}`);
    }
}

window.clearLog = () => {
    document.getElementById('log').innerHTML = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateStatus();
    addLog('Plugin ready');
});
