# Contextual Query Copier - Chrome Extension

This Chrome extension allows you to quickly copy a word and its surrounding text (paragraph or block) formatted as a question: "What does [word] mean in [entire passage of text]?". This is useful for quickly looking up terms or phrases in their original context.

## Features

*   Selects the word currently under the mouse cursor when a hotkey is pressed.
*   Selects the surrounding paragraph or text block.
*   Formats a question string: "What does "[word]" mean in "[paragraph]""?
*   Copies the formatted string to the clipboard.
*   Default hotkey: **F9** (customizable).

## Installation (Loading the Unpacked Extension)

1.  **Download or Clone:**
    *   If you have downloaded this as a ZIP, extract all files to a folder on your computer.
    *   If you are cloning from a Git repository, clone it to a local directory.

2.  **Open Chrome Extensions Page:**
    *   Open Google Chrome.
    *   Navigate to `chrome://extensions` in the address bar.

3.  **Enable Developer Mode:**
    *   In the top right corner of the Extensions page, toggle the "Developer mode" switch to the **on** position.

4.  **Load Unpacked:**
    *   Click the "Load unpacked" button that appears (usually on the top left).
    *   In the file dialog, navigate to the folder where you extracted or cloned the extension files.
    *   Select the folder (it should contain `manifest.json`, `content.js`, etc.) and click "Select Folder".

5.  **Ready to Use:**
    *   The "Contextual Query Copier" extension should now appear in your list of extensions and be active.

## How to Use

1.  Navigate to any webpage with text content.
2.  Move your mouse cursor over the specific word you are interested in.
3.  Press the activation hotkey (default is **F9**).
4.  The formatted question ("What does [word] mean in [passage]?") will be automatically copied to your clipboard.
5.  You can then paste this question into a search engine, notes app, etc.

## Customizing the Hotkey

1.  **Open Extension Shortcuts:**
    *   Navigate to `chrome://extensions/shortcuts` in your Chrome browser.
    *   Alternatively, go to `chrome://extensions`, find "Contextual Query Copier", click "Details", and then click "Keyboard shortcuts".

2.  **Find the Command:**
    *   Locate "Contextual Query Copier" in the list.
    *   You will see the command "Copy word and context as a question".

3.  **Change the Shortcut:**
    *   Click the pencil icon (edit) next to the command.
    *   Press your desired key combination (e.g., `Ctrl+Shift+S`, `Alt+Q`).
    *   Your new hotkey is now set.

## Files

*   `manifest.json`: Defines the extension's properties, permissions, and scripts.
*   `background.js`: Listens for the hotkey command and messages the content script.
*   `content.js`: Contains the core logic to select text, format the string, and copy to clipboard. Runs on web pages.
*   `options.html` & `options.js`: Provides a page (accessible via extension options) that guides users to `chrome://extensions/shortcuts` for hotkey customization.
*   `README.md`: This file.

## Troubleshooting

*   **Hotkey Not Working?**
    *   Ensure the extension is enabled in `chrome://extensions`.
    *   Check `chrome://extensions/shortcuts` to confirm your hotkey and ensure it's not conflicting with other extension or Chrome shortcuts.
    *   Try a different hotkey.
*   **Incorrect Text Copied?**
    *   The accuracy of word and paragraph selection can vary depending on the structure of the webpage.
    *   The script tries its best to identify logical text blocks. If it's consistently failing on a specific type of site, that might indicate a complex DOM structure that's hard to parse generally.
*   **Permissions:** The extension requires `activeTab` (to read page content), `clipboardWrite` (to copy to clipboard), `scripting` (to inject content script functionality), and `commands` (for the hotkey).
