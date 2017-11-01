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
import { requestTopics, selectTopic, toggleDrawer } from './actions';

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
    },
    selectTopic(topic) {
      dispatch(selectTopic(topic));
    },
    toggleDrawer() {
      dispatch(toggleDrawer());
    }
  };
}

NavigationContainer.propTypes = {
  requestTopics: PropTypes.func.isRequired,
  selectTopic: PropTypes.func.isRequired,
  toggleDrawer: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationContainer);
