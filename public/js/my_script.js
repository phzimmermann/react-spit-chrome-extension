var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('/js/my_file.js');
s.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);


window.addEventListener('message', function(event) {

  // Only accept messages from same frame
  if (event.source !== window) {
    return;
  }

  var message = event.data;

  // Only accept messages that we know are ours
  if (typeof message !== 'object' || message === null || !message.spit_event) {
    return;
  }

  chrome.runtime.sendMessage(message);
});
