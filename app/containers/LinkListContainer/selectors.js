import { createSelector } from 'reselect';
import selectNavigationContainer from '../NavigationContainer/selectors';

/**
 * Direct selector to the linkListContainer state domain
 */
const selectLinkListContainerDomain = () => (state) => state.get('linkListContainer');

/**
 * Other specific selectors
 */

// 从路由获取topic name
const selectRouteTopic = () => (state, props) => props.params.topicName;

// 对路由获取的 topic name 进行处理，如果 topics 中没有，返回 name 为空字符串的对象
const selectTopic = () =>
  createSelector(selectNavigationContainer(), selectRouteTopic(), (navigationState, routeTopicName) => {
    const selectedTopic = navigationState.topics.find((t) => t.name === routeTopicName);
    return selectedTopic || { name: '' };
  });

/**
 * Default selector used by LinkListContainer
 */

// 把 topicName 加入到 state 中
const selectLinkListContainer = () =>
  createSelector(selectLinkListContainerDomain(), selectTopic(), (substate, topic) => {
    return Object.assign(substate.toJS(), { topicName: topic.name });
  });

export default selectLinkListContainer;
export { selectLinkListContainerDomain };
