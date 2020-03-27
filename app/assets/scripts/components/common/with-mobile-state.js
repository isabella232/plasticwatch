// Based on https://github.com/finnfiddle/react-window-size
import React, { Component } from 'react';
import { mediaRanges } from '../../styles/theme/theme';

export default ComposedComponent => {
  class withMobileState extends Component {
    constructor (props) {
      super(props);

      this.state = {
        isMobile: window.innerWidth < mediaRanges.medium[0]
      };

      this.onDocResize = this.onDocResize.bind(this);
    }

    componentDidMount () {
      window.addEventListener('resize', this.onDocResize);
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.onDocResize);
    }

    onDocResize () {
      const isMobile = window.innerWidth < mediaRanges.medium[0];
      if (this.state.isMobile !== isMobile) {
        this.setState({ isMobile });
      }
    }

    getWrappedInstance () {
      return this.wrappedInstance;
    }

    render () {
      return (
        <ComposedComponent
          {...this.props}
          ref={c => {
            this.wrappedInstance = c;
          }}
          isMobile={this.state.isMobile}
        />
      );
    }
  }

  const composedComponentName =
    ComposedComponent.displayName || ComposedComponent.name || 'Component';

  withMobileState.displayName = `withMobileState(${composedComponentName})`;
  return withMobileState;
};
