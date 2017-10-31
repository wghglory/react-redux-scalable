/*
 *
 * LinkListContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectLinkListContainer from './selectors';
import LinkList from '../../components/LinkList/index';

/* eslint-disable react/prefer-stateless-function */
export class LinkListContainer extends React.Component {
  render() {
    return <LinkList {...this.props} />;
  }
}

const mapStateToProps = selectLinkListContainer();

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkListContainer);
