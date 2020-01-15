import * as React from 'react';
import { range } from './util';

export interface Props {
  rows?: number;
  columns?: number;
}

const styles = {
  container: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  row: {
    height: 1,
    backgroundColor: 'white',
    opacity: 0.3
  },
  column: {
    width: 1,
    backgroundColor: 'white',
    opacity: 0.3
  },
  item: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
};

export class Grid extends React.Component<Props> {
  public static defaultProps = {
    rows: 20,
    columns: 32
  };

  render() {
    const { rows, columns } = this.props;

    return (
      <div style={styles.container}>
        <div
          style={{
            ...styles.item,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {range(rows!).map(i => <div key={i} style={styles.row} />)}
        </div>
        <div style={{ ...styles.item, display: 'flex', justifyContent: 'space-between' }}>
          {range(columns!).map(i => <div key={i} style={styles.column} />)}
        </div>
      </div>
    );
  }
}
