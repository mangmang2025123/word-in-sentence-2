// Listen for the command execution
chrome.commands.onCommand.addListener(function(command) {
  if (command === "execute_copy_action") {
    // Get the currently active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
        // Send a message to the content script in the active tab
        chrome.tabs.sendMessage(tabs[0].id, {action: "get_word_and_context"});
      } else {
        console.error("No active tab found.");
      }
    });
  }
});
