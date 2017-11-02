import { REQUEST_TOPICS, SELECT_TOPIC, REQUEST_TOPICS_SUCCEEDED } from './constants';
import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { requestTopicsSucceeded, requestTopicsFailed } from './actions';
import { push } from 'react-router-redux';
import selectNavigationContainer from './selectors';

export function fetchTopicsFromServer() {
  return fetch('http://localhost:3000/api/topics').then((res) => res.json());
}

function* fetchTopics() {
  try {
    const topics = yield call(fetchTopicsFromServer); // fetch data
    console.log('Topics from server', topics);
    yield put(requestTopicsSucceeded(topics)); // dispatch another successful action
  } catch (error) {
    yield put(requestTopicsFailed('failed to fetch data')); // dispatch failed action
  }
}

function* pushTopic(action) {
  yield put(push(`/topics/${action.topic.name}`));
}

function* selectDefaultTopic() {
  const state = yield select(selectNavigationContainer());
  // 当没有选中 topic 且 访问 / 时候再跳转到第一个 topic。
  // routerLocation 看 navigationContainerReducer 的 @@router/LOCATION_CHANGE
  if (!state.selectedTopic && state.routerLocation === '/') {
    yield pushTopic({
      topic: state.topics[0]
    });
  }
}

// Individual exports for testing
export function* selectTopicsSaga() {
  yield takeLatest(SELECT_TOPIC, pushTopic);
}

export function* selectDefaultTopicSaga() {
  yield takeLatest(REQUEST_TOPICS_SUCCEEDED, selectDefaultTopic);
}

export function* fetchTopicsSaga() {
  yield takeLatest(REQUEST_TOPICS, fetchTopics);
}

// All sagas to be loaded
export default [fetchTopicsSaga, selectTopicsSaga, selectDefaultTopicSaga];
