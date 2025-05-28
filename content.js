// Global variable to store mouse coordinates
let lastMouseX = 0;
let lastMouseY = 0;

// Track mouse movement to capture coordinates
document.addEventListener('mousemove', function(event) {
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}, true); // Use capturing phase to get event before other listeners

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "get_word_and_context") {
    try {
      // Get the element under the last known mouse position
      const elementUnderMouse = document.elementFromPoint(lastMouseX, lastMouseY);

      if (!elementUnderMouse) {
        console.warn("No element under mouse.");
        sendResponse({status: "error", message: "No element under mouse."});
        return;
      }

      // 1. Get the word under the mouse cursor
      let word = "";
      const selection = window.getSelection();
      if (selection.rangeCount > 0) selection.removeAllRanges(); // Clear previous selection

      // Try to use caretPositionFromPoint to get the precise text node and offset
      let range;
      if (document.caretPositionFromPoint) {
        const caretPos = document.caretPositionFromPoint(lastMouseX, lastMouseY);
        if (caretPos && caretPos.offsetNode) {
          range = document.createRange();
          range.setStart(caretPos.offsetNode, caretPos.offset);
          range.setEnd(caretPos.offsetNode, caretPos.offset); // Collapse the range to a point

          // Expand the range to select the word
          // This is a common way to do it:
          // Check if the caret is inside a text node
          if (caretPos.offsetNode.nodeType === Node.TEXT_NODE) {
            const textNode = caretPos.offsetNode;
            const textContent = textNode.textContent;
            let start = caretPos.offset;
            let end = caretPos.offset;

            // Expand backwards
            while (start > 0 && textContent[start - 1].match(/\S/)) {
              start--;
            }
            // Expand forwards
            while (end < textContent.length && textContent[end].match(/\S/)) {
              end++;
            }
            range.setStart(textNode, start);
            range.setEnd(textNode, end);
            selection.addRange(range);
            word = selection.toString().trim();
          }
        }
      }
      
      // Fallback or alternative if caretPositionFromPoint didn't yield a word,
      // or if we want to ensure the element itself's text is used if it's small.
      if (!word && elementUnderMouse.textContent.trim()) {
        // This is a simpler fallback, might not be as accurate as caret-based selection.
        // It might select more than a single word if the element is small and contains multiple words.
        // For a more robust word selection here, one might need to split elementUnderMouse.textContent
        // and find the word closest to the mouse click, which is more involved.
        // Given the context of a hotkey, the caretPositionFromPoint method is preferred.
        // If that fails, we'll try a simpler selection on the element.
        selection.removeAllRanges();
        range = document.createRange();
        range.selectNodeContents(elementUnderMouse); // Select content of the element
        selection.addRange(range); // Add new range
        // Attempt to collapse and re-expand to word, this is tricky without caret info
        // For now, if caretPositionFromPoint fails, this part might be less accurate.
        // A simple approach if word is still empty:
        if (!word) {
            // Try to select the word based on the element's text content directly
            // This is a very basic word selection from the element's text content
            const elementText = elementUnderMouse.textContent.trim();
            const wordsInElement = elementText.split(/\s+/);
            // This doesn't know *which* word the mouse was over, takes the first as a rough fallback
            if (wordsInElement.length > 0) {
                 word = wordsInElement[0]; // Or some other logic to pick a word
            }
        }
      }
      selection.removeAllRanges(); // Clean up selection

      if (!word) {
        console.warn("Could not determine word under cursor.");
        // Attempt to use the text content of the elementUnderMouse as a last resort for "word"
        word = elementUnderMouse.innerText.trim().split(/\s+/)[0] || elementUnderMouse.innerText.trim() || "selected text";
        if (!word) {
            sendResponse({status: "error", message: "Could not determine word."});
            return;
        }
      }

      // 2. Get the surrounding paragraph or block of text
      let paragraphText = "";
      if (elementUnderMouse) {
        // Use closest() to find the nearest ancestor that is a common paragraph-like element or a sectioning element.
        // The order in the selector string can matter if elements are nested (e.g., a P inside a DIV).
        // We're looking for the most specific sensible block.
        const closestBlock = elementUnderMouse.closest('P, LI, H1, H2, H3, H4, H5, H6, PRE, BLOCKQUOTE, TD, ARTICLE, SECTION, ASIDE, FIGCAPTION, FIGURE, NAV, MAIN, HEADER, FOOTER');

        if (closestBlock) {
          paragraphText = closestBlock.innerText || closestBlock.textContent;
        } else {
          // Fallback if no specific block is found, use the element itself or its direct parent DIV if that makes sense
          const parentDiv = elementUnderMouse.closest('DIV');
          if (parentDiv) {
            paragraphText = parentDiv.innerText || parentDiv.textContent;
          } else if (elementUnderMouse.innerText || elementUnderMouse.textContent) {
            // If truly nothing else, use the element under mouse itself
             paragraphText = elementUnderMouse.innerText || elementUnderMouse.textContent;
          }
        }
      }
      
      paragraphText = paragraphText.trim().replace(/\s+/g, ' '); // Normalize spaces

      if (!paragraphText) {
        console.warn("Could not determine paragraph/text block.");
        sendResponse({status: "error", message: "Could not determine paragraph."});
        return;
      }

      // 3. Construct the string
      const newSentence = `What does "${word}" mean in "${paragraphText}"?`;

      // 4. Copy to clipboard
      navigator.clipboard.writeText(newSentence)
        .then(() => {
          console.log("Copied to clipboard:", newSentence);
          // Optional: Send a success response or create a small visual notification
          sendResponse({status: "success", copiedText: newSentence});
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          sendResponse({status: "error", message: "Failed to copy to clipboard."});
        });

    } catch (e) {
      console.error("Error in content script:", e);
      sendResponse({status: "error", message: e.toString()});
    }
    return true; // Indicates that the response will be sent asynchronously
  }
});
