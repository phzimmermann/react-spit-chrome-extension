import stackTrace from 'stacktrace-js';

let order = 0;

const sendMessageToExtension = (identifier, data, trace) => {
  window.postMessage({
    spit_event: true,
    identifier,
    data,
    trace,
    order: order++,
  }, '*');
};

const getStackTrace = (identifier, data, debugError) => {
  if (debugError) {
    stackTrace.fromError(debugError).then(trace => {
      sendMessageToExtension(identifier, data, trace);
    });
  } else {
    sendMessageToExtension(identifier, data, []);
  }
}

const Communicator = class Communicator {
  onChange(spitEvent, data, debugError) {
    getStackTrace(spitEvent.getIdentifier(), data, debugError);
  }

  set(data, ev, debugError) {
    this.onChange(ev, data, debugError);
  }

  onAddEvent(ev) {
    ev.addListener(this);
  }
}

Communicator.prototype.debug = true;


const registerStore = store => {
  window.postMessage({
    spit_event: true,
    page_init: true,
  }, '*');
  const communicator = new Communicator();
  store.addListener(communicator);
  store.getEvents().forEach(ev => {
    ev.addListener(communicator);
    communicator.onChange(ev, ev.get())
  });
}

window.__REACT_SPIT_DEV_TOOLS__ = registerStore;
