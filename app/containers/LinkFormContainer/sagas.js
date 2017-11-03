import { ADD_LINK, ADD_LINK_CANCELLED } from './constants';
import { take, call, put, select } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { createLink } from '../../api/index';
import { goBack } from 'react-router-redux';
import { addLinkSucceeded, addLinkFailed } from './actions';

function* addLink(action) {
  try {
    const serverLink = yield call(createLink, action.link);
    yield put(addLinkSucceeded(serverLink));
    yield put(goBack());
  } catch (error) {
    yield put(addLinkFailed(action.link, error.message));
  }
}

// Individual exports for testing
export function* addLinkSaga() {
  yield takeLatest(ADD_LINK, addLink);
}

export function* addLinkCancelledSaga() {
  yield takeLatest(ADD_LINK_CANCELLED, () => put(goBack()));
}

// All sagas to be loaded
export default [addLinkSaga, addLinkCancelledSaga];
