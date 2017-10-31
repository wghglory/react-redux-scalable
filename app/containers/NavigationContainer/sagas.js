import { REQUEST_TOPICS } from './constants';
import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { requestTopicsSucceeded, requestTopicsFailed } from './actions';

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

// Individual exports for testing
export function* fetchTopicsSaga() {
  yield takeLatest(REQUEST_TOPICS, fetchTopics);
}

// All sagas to be loaded
export default [fetchTopicsSaga];
