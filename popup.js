document.addEventListener('DOMContentLoaded', function () {
    var block_button = document.getElementById("blockbutton");
    var reset_button = document.getElementById("resetbutton");

    block_button.addEventListener("click", function() {
        var emoteValue = document.getElementById('enter-emote-box').value.trim();
        if (emoteValue !== "") { // To check that u actually wrote something
            chrome.storage.local.get('emote_block_list', function(data) { // Google local storage
                var emote_block_list = data.emote_block_list || [];
                emote_block_list.push(emoteValue);
                chrome.storage.local.set({ 'emote_block_list': emote_block_list }, function() {
                    chrome.tabs.query({ active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'block', emote_block_list: emote_block_list})
                    });
                });
            });
            document.getElementById('enter-emote-box').value = ""; // make text box empty after you press BLOCK
        }
    });

    // reset block list 
    reset_button.addEventListener("click", function() {
        chrome.storage.local.remove('emote_block_list', function() {
            chrome.tabs.query({ active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'reset'})
            });
        });
    });
});
