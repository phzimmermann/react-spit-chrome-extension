import React from 'react';

export default class TraceView extends React.Component {
  render() {
    const { traces } = this.props;
    if (traces.length) {
      return (
        <div>
          {traces.slice(2).map(line => (
            <div>
              {line.fileName}:{line.lineNumber}:{line.functionName}
            </div>
          ))}
        </div>
      );
    }

    return <div>Initial data</div>;
  }
}
