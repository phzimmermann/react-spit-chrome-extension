const sendMessageToExtension = (identifier, data) => {
  window.postMessage({
    spit_event: true,
    identifier,
    data,
  }, '*');
};

const Communicator = class Communicator {
  onChange(spitEvent, data) {
    console.log(spitEvent.getIdentifier(), data, 'here');
    sendMessageToExtension(spitEvent.getIdentifier(), data);
  }

  set(data, ev) {
    this.onChange(ev, data);
  }

  onAddEvent(ev) {
    ev.addListener(this);
  }
}


const registerStore = store => {
  const communicator = new Communicator();
  store.addListener(communicator);
  store.getEvents().forEach(ev => {
    ev.addListener(communicator);
    communicator.onChange(ev, ev.get())
  });
}

window.__REACT_SPIT_DEV_TOOLS__ = registerStore;
