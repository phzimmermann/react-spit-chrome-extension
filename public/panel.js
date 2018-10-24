

// Create a connection to the background page
const backgroundPageConnection = chrome.runtime.connect({
  name: 'panel'
});

setTimeout(() => {
  backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
  });
}, 500);

backgroundPageConnection.onMessage.addListener(function(msg) {
  document.write(JSON.stringify(msg));
});

// console.log(backgroundPageConnection);
