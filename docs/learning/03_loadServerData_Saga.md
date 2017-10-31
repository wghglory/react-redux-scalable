# Loading Data from the Server with Redux-saga

**app/NavigationContainer/constants.js**:

```javascript
export const REQUEST_TOPICS = 'app/NavigationContainer/REQUEST_TOPICS';
export const REQUEST_TOPICS_SUCCEEDED = 'app/NavigationContainer/REQUEST_TOPICS_SUCCEEDED';
export const REQUEST_TOPICS_FAILED = 'app/NavigationContainer/REQUEST_TOPICS_FAILED';
```

**app/NavigationContainer/actions.js**:

```javascript
import { REQUEST_TOPICS, REQUEST_TOPICS_FAILED, REQUEST_TOPICS_SUCCEEDED } from './constants';

export function requestTopics() {
  return {
    type: REQUEST_TOPICS
  };
}

export function requestTopicsSucceeded(topics) {
  return {
    type: REQUEST_TOPICS_SUCCEEDED,
    topics
  };
}

export function requestTopicsFailed(message) {
  return {
    type: REQUEST_TOPICS_FAILED,
    message
  };
}
```

**NavigationContainer/index.js**:

```diff
import React from 'react';
import { connect } from 'react-redux';
import selectNavigationContainer from './selectors';
import Navigation from '../../components/Navigation/index';
import PropTypes from 'prop-types';
+ import { requestTopics } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class NavigationContainer extends React.Component {
+  componentDidMount() {
+    this.props.requestTopics();
+  }
  render() {
    return <Navigation {...this.props} />;
  }
}

const mapStateToProps = selectNavigationContainer();

function mapDispatchToProps(dispatch) {
  return {
+    requestTopics() {
+      dispatch(requestTopics());
+    }
  };
}

NavigationContainer.propTypes = {
  requestTopics: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationContainer);
```

**saga.js**:

```javascript
import { REQUEST_TOPICS } from './constants';
import { takeLatest } from 'redux-saga';
import { take, call, put, select } from 'redux-saga/effects';
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
  yield takeLatest(REQUEST_TOPICS, fetchTopics);  // always listening for "REQUEST_TOPICS" action, and call fetchTopics
}

// All sagas to be loaded
export default [fetchTopicsSaga];
```

**reducer.js**:

```diff
import { fromJS } from 'immutable';
+ import { REQUEST_TOPICS_SUCCEEDED } from './constants';

const initialState = fromJS({
+  topics: []
});

function navigationContainerReducer(state = initialState, action) {
  switch (action.type) {
+    case REQUEST_TOPICS_SUCCEEDED:
+      return state.set('topics', action.topics);
    default:
      return state;
  }
}

export default navigationContainerReducer;
```