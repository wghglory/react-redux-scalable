import { take, call, put, select } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { SELECT_TOPIC } from '../NavigationContainer/constants';
import { requestLinksFailed, requestLinksSucceeded } from './actions';

function fetchLinksFromServer(topic) {
  return fetch(`http://localhost:3000/api/topics/${topic.name}/links`).then((res) => res.json());
}

function* fetchLinks(action) {
  try {
    // fetch links based on topic
    const links = yield call(fetchLinksFromServer, action.topic); // passing parameter at 2nd
    // dispatch an action to store links
    console.log('data', links);
    yield put(requestLinksSucceeded(links));
  } catch (e) {
    // dispatch action to store error
    yield put(requestLinksFailed('failed to get data'));
  }
}

// Individual exports for testing
export function* defaultSaga() {
  yield takeLatest(SELECT_TOPIC, fetchLinks);
}

// All sagas to be loaded
export default [defaultSaga];
