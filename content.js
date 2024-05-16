// Emotes you have blocked
function removeEmoteElements(blockList) {
    if (blockList) {
        blockList.forEach(function(emote) {
            document.querySelectorAll(".seventv-chat-emote[alt='" + emote + "']").forEach(function(chosen_chat_emote) {
                var leftover_message = document.createElement("a");
                leftover_message.appendChild(document.createTextNode(emote));

                leftover_message.style.color = "white"; // make the text as if nothing happend
                leftover_message.style.textDecoration = "none";

                chosen_chat_emote.parentNode.insertBefore(leftover_message, chosen_chat_emote.nextSibling);
                chosen_chat_emote.remove();
            });
        });
    }
}

var observer;
var emote_block_list;

// watches for changes in the whole page
function startObserver() {
    observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                removeEmoteElements(emote_block_list);
            }
        });
    });

    // Look at changes in Twitch chat
    observer.observe(document.documentElement, {
        childList: true, 
        subtree: true
    });
}

function stopObserver() {
    if (observer) {
        observer.disconnect();
    }
}

// Apply your blocked emotes on load
function applyBlockedEmotesOnLoad() {
    chrome.storage.local.get('emote_block_list', function(data) {
        if (data.emote_block_list) {
            emote_block_list = data.emote_block_list; // basically: tracked emoted = all the emotes you have blocked
            removeEmoteElements(emote_block_list);
            startObserver();
        }
    });
} 
applyBlockedEmotesOnLoad();


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'block') {
        // pdate emote block list
        emote_block_list = request.emote_block_list || [];
        
        // check js:2
        removeEmoteElements(emote_block_list);

        startObserver();

        sendResponse({ message: 'Emote blocked.' });

    } else if (request.action === 'reset') {
        stopObserver();
        chrome.storage.local.clear(function() {
            console.log("All data cleared from Chrome storage.");
        });
        
        // clears the local blocklist, not that it matters though
        emote_block_list = [];
        sendResponse({ message: 'Blocklist reset.' });
    }
});
