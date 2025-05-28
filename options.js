// This script is minimal as users change shortcuts via chrome://extensions/shortcuts

document.addEventListener('DOMContentLoaded', function() {
  const shortcutInfo = document.getElementById('shortcut-info');
  
  // Check if chrome.commands is available
  if (chrome.commands && typeof chrome.commands.getAll === 'function') {
    chrome.commands.getAll(function(commands) {
      let commandFound = false;
      if (commands) {
        for (let command of commands) {
          if (command.name === "execute_copy_action") {
            shortcutInfo.textContent = `Current configured shortcut: ${command.shortcut || 'Not set (Default: F9)'}`;
            commandFound = true;
            break;
          }
        }
      }
      if (!commandFound) {
        shortcutInfo.textContent = 'Could not retrieve current shortcut. Please check chrome://extensions/shortcuts. Default is F9.';
      }
    });
  } else {
    console.warn("chrome.commands API not available in this context. This is expected if the options page is opened directly as a file URL without the extension context.");
    shortcutInfo.textContent = 'To set or change the shortcut, go to chrome://extensions/shortcuts. The default is F9.';
  }
});
