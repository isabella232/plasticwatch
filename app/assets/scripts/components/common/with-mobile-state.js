// Based on https://github.com/finnfiddle/react-window-size
import React, { Component } from 'react';
import { mediaRanges } from '../../styles/theme/theme';
import PropTypes from 'prop-types';

export default (ComposedComponent) => {
  class WithMobileState extends Component {
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
          isMobile={this.state.isMobile}
          ref={this.props.forwardedRef}
        />
      );
    }
  }

  WithMobileState.propTypes = {
    forwardedRef: PropTypes.object
  };

  const composedComponentName =
    ComposedComponent.displayName || ComposedComponent.name || 'Component';

  WithMobileState.displayName = `withMobileState(${composedComponentName})`;

  return React.forwardRef((props, ref) => {
    return <WithMobileState {...props} forwardedRef={ref} />;
  });
};
