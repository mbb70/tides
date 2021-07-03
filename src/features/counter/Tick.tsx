import React from 'react';

import {
  setTime,
  timeSelector,
} from './tidesSlice';
import { connect } from 'react-redux';
import { RootState } from '../../app/store';

interface Props {
  setTime: (payload: { time: number }) => void;
  time: number;
}

class TickComponent extends React.Component<Props> {
  state = {
    intervalId: 0,
  }

  componentDidMount() {
    // Run time at 5 minutes a second for development
    const intervalId = setInterval(() => {
      this.props.setTime({
        time: process.env.NODE_ENV === 'production' ? Date.now() : this.props.time + 5*60*1000
      })
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
    time: timeSelector(state)
  };
};

const mapDispatch = {
  setTime,
}

export const Tick = connect(mapStateToProps, mapDispatch)(TickComponent)
