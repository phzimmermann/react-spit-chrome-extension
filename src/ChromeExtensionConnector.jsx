/* global chrome */
import React from 'react';
import JSONTree from 'react-json-tree';
import TraceView from './TraceView';

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
          datas: [{ data: msg.data, trace: msg.trace, order: msg.order }],
        },
      },
    };
  } else {
    const newDatas = [
      ...state.containers[msg.identifier].datas,
      { data: msg.data, trace: msg.trace, order: msg.order },
    ];
    return {
      containers: {
        ...(state.containers || {}),
        [msg.identifier]: {
          ...state.containers[msg.identifier],
          datas: newDatas.sort((a, b) => a.order > b.order),
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

    if (msg.page_init) {
      this.setState({ containers: {}, selectedVersion: null, selectedIdentifier: null });
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
          <h2>Active Spit Containers</h2>
          <div className="menu menu-container">
            {Object.keys(this.state.containers).map(identifier => (
              <div
                className={this.state.selectedIdentifier === identifier ? 'selected item' : 'item'}
                onClick={() => this.setState({ selectedIdentifier: identifier, selectedVersion: 0 })}
              >
                {identifier}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>Versions</h2>
          <div className="menu">
            {this.state.selectedIdentifier !== null &&
              this.state.containers[this.state.selectedIdentifier].datas.map((data, index) => (
                <div
                  className={this.state.selectedVersion === index ? 'selected item' : 'item'}
                  onClick={() => this.setState({ selectedVersion: index })}
                >
                  Update {index}
                </div>
              ))}
          </div>
        </div>
        <div>
          <h2>Data</h2>
          {this.state.selectedVersion !== null && (
            <div>
              <JSONTree
                data={this.state.containers[this.state.selectedIdentifier].datas[this.state.selectedVersion].data}
              />
            </div>
          )}
        </div>
        <div>
          <h2>Trace</h2>
          <div className="menu menu-white">
            {this.state.selectedVersion !== null && (
              <TraceView
                traces={this.state.containers[this.state.selectedIdentifier].datas[this.state.selectedVersion].trace}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
