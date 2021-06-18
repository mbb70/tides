import React from 'react';

import {
  setTime,
  selectTime,
} from './tidesSlice';
import { connect } from 'react-redux';
import { RootState } from '../../app/store';

interface Props {
  setTime: (payload: { time: number }) => void;
}

class TickComponent extends React.Component<Props> {
  state = {
    intervalId: 0,
  }

  componentDidMount() {
    const intervalId = setInterval(() => {
      this.props.setTime({ time: Date.now() })
    }, 1000)
    this.setState({ intervalId })
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    return null;
  }
}
const mapStateToProps = (state: RootState) => {
  return {
    time: selectTime(state)
  };
};

const mapDispatch = {
  setTime,
}

export const Tick = connect(mapStateToProps, mapDispatch)(TickComponent)
