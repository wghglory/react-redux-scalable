/*
 *
 * NavigationContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectNavigationContainer from './selectors';
import Navigation from '../../components/Navigation/index';
import PropTypes from 'prop-types';
import { requestTopics } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class NavigationContainer extends React.Component {
  componentDidMount() {
    this.props.requestTopics();
  }
  render() {
    return <Navigation {...this.props} />;
  }
}

const mapStateToProps = selectNavigationContainer();

function mapDispatchToProps(dispatch) {
  return {
    requestTopics() {
      dispatch(requestTopics());
    }
  };
}

NavigationContainer.propTypes = {
  requestTopics: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationContainer);
