import { take, call, put, select } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { requestLinksFailed, requestLinksSucceeded } from './actions';
import { REQUEST_LINKS } from './constants';

function fetchLinksFromServer(topicName) {
  return fetch(`http://localhost:3000/api/topics/${topicName}/links`).then((res) => res.json());
}

function* fetchLinks(action) {
  try {
    // fetch links based on topic
    const links = yield call(fetchLinksFromServer, action.topicName); // passing parameter at 2nd
    // dispatch an action to store links
    yield put(requestLinksSucceeded(links));
  } catch (e) {
    // dispatch action to store error
    yield put(requestLinksFailed(e.message));
  }
}

// container 在初始化的时候就发送 requestLinks 请求了，需要传递 topicName
export function* defaultSaga() {
  yield takeLatest(REQUEST_LINKS, fetchLinks);
}

// All sagas to be loaded
export default [defaultSaga];
