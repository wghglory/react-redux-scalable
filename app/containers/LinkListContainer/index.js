/*
 *
 * LinkListContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import selectLinkListContainer from './selectors';
import LinkList from '../../components/LinkList/index';
import { requestLinks } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class LinkListContainer extends React.Component {
  // 首次加载
  componentDidMount() {
    // where does topicName come from?
    // 1. routes 调用相应的 saga、匹配加载当前 container,
    // 2. mapStateToProps 调用 selector，selector 中从 route 获取到 props.params.topicName，并将其放到 state 中。mapState 到 props 中
    this.props.requestLinks(this.props.topicName);
  }

  // 点击 drawer 中不同 topic，路由变化，由于路由中的 topicName props 发生发生变化而触发
  componentWillReceiveProps(nextProps) {
    if (nextProps.topicName !== this.props.topicName) {
      this.props.requestLinks(nextProps.topicName);
    }
  }

  render() {
    return <LinkList {...this.props} />;
  }
}

const mapStateToProps = selectLinkListContainer();

function mapDispatchToProps(dispatch) {
  return {
    requestLinks(topicName) {
      dispatch(requestLinks(topicName));
    }
  };
}

LinkListContainer.propTypes = {
  topicName: PropTypes.string.isRequired,
  requestLinks: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(LinkListContainer);
