/* global chrome */
import React from 'react';
import JSONTree from 'react-json-tree';

// Create a connection to the background page
const backgroundPageConnection = chrome.runtime.connect({
  name: 'panel',
});

setTimeout(() => {
  backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId,
  });
}, 0);

const updateState = msg => state => {
  if (!(msg.identifier in (state.containers || {}))) {
    return {
      containers: {
        ...(state.containers || {}),
        [msg.identifier]: {
          datas: [{ data: msg.data }],
        },
      },
    };
  } else {
    return {
      containers: {
        ...(state.containers || {}),
        [msg.identifier]: {
          ...state.containers[msg.identifier],
          datas: [{ data: msg.data }, ...state.containers[msg.identifier].datas],
        },
      },
    };
  }
};

export default class ChromeExtensionConnector extends React.Component {
  state = {
    containers: {},
    selectedVersion: null,
    selectedIdentifier: null,
  };

  onMessage = msg => {
    if (!msg.spit_event) {
      return;
    }

    this.setState(updateState(msg));
  };

  componentDidMount() {
    backgroundPageConnection.onMessage.addListener(this.onMessage);
  }

  render() {
    return (
      <div>
        <div>
          <h2>Identifiers</h2>
          {Object.keys(this.state.containers).map(identifier => (
            <div>
              <div onClick={() => this.setState({ selectedIdentifier: identifier })}>{identifier}</div>
            </div>
          ))}
        </div>
        <div>
          <h2>Versions</h2>
          {this.state.selectedIdentifier !== null && (
            <div>
              {this.state.containers[this.state.selectedIdentifier].datas.map((data, index) => (
                <div onClick={() => this.setState({ selectedVersion: index })}>{index}</div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2>Data</h2>
          {this.state.selectedVersion !== null && (
            <div>
              <JSONTree data={this.state.containers[this.state.selectedIdentifier].datas[this.state.selectedVersion].data} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
