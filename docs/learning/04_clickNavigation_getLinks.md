# Click Navigation topic, send new request and fetch links data

Now our navigation has 3 data: libraries, apps, news. Each of them has corresponding links. We want to fetch these links by navigation categories. Whenever we click any navigation category, we send a request passing that category as parameter and fetch relative data.

## Task 1: Add selectTopic function to Navigation component

Aim: Clicking any navigation topic will update redux store `selectedTopic`. Based on the selectedTopic, we can easily fetch relative links.

### Navigation Component: Loading topics and selectTopic when clicking

We need to pass selectTopic function from NavigationContainer, which should dispatch an action.

```diff
+ function Navigation({ topics, selectTopic }) {
  return (
    <div className={styles.navigation}>
+      {topics.map((t) => (
+        <div key={t.name} onClick={() => selectTopic(t)}>
+          {t.name}
+        </div>
+      ))}
    </div>
  );
}

Navigation.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired,
+  selectTopic: PropTypes.func.isRequired
};
```

### NavigationContainer constants

```diff
export const REQUEST_TOPICS = 'app/NavigationContainer/REQUEST_TOPICS';
export const REQUEST_TOPICS_SUCCEEDED = 'app/NavigationContainer/REQUEST_TOPICS_SUCCEEDED';
export const REQUEST_TOPICS_FAILED = 'app/NavigationContainer/REQUEST_TOPICS_FAILED';
+ export const SELECT_TOPIC = 'app/NavigationContainer/SELECT_TOPIC';
```

### NavigationContainer actions

```diff
+ import { REQUEST_TOPICS, REQUEST_TOPICS_FAILED, REQUEST_TOPICS_SUCCEEDED, SELECT_TOPIC } from './constants';

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

+ // pass the selected topic
+ export function selectTopic(topic) {
+   return {
+     type: SELECT_TOPIC,
+     topic
+   };
+ }
```

### NavigationContainer reducer

```diff
import { fromJS } from 'immutable';
+ import { REQUEST_TOPICS_SUCCEEDED, SELECT_TOPIC } from './constants';

const initialState = fromJS({
  topics: []
});

function navigationContainerReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_TOPICS_SUCCEEDED:
      return state.set('topics', action.topics);
+    case SELECT_TOPIC:
+      return state.set('selectedTopic', action.topic);
    default:
      return state;
  }
}

export default navigationContainerReducer;
```

### NavigationContainer: map the selectTopic function to props

```diff
import React from 'react';
import { connect } from 'react-redux';
import selectNavigationContainer from './selectors';
import Navigation from '../../components/Navigation/index';
import PropTypes from 'prop-types';
+ import { requestTopics, selectTopic } from './actions';

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
+    selectTopic(topic) {
+      dispatch(selectTopic(topic));
+    }
  };
}

NavigationContainer.propTypes = {
  requestTopics: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationContainer);
```

---

## Task 2: Add LinkList Component and Container

saga listens to `SELECT_TOPIC` action, and fetch data.

### generate LinkListContainer and LinkList Component

use below commands to generate components: (follow 01_scaffolding.md)

```bash
npm run generate Container
npm run generate Component
```

### Include sagas and reducers in routes.js

```diff
import { getAsyncInjectors } from 'utils/asyncInjectors';

//...

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage'),
          System.import('containers/NavigationContainer/reducer'),
          System.import('containers/NavigationContainer/sagas'),
+          System.import('containers/LinkListContainer/reducer'),
+          System.import('containers/LinkListContainer/sagas')
        ]);

        const renderRoute = loadModule(cb);

+        importModules.then(([component, navigationReducer, navigationSagas, linkListReducer, linkListSagas]) => {
          injectReducer('navigationContainer', navigationReducer.default);
          injectSagas('navigationContainer', navigationSagas.default);
+          injectReducer('linkListContainer', linkListReducer.default);
+          injectSagas('linkListContainer', linkListSagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      }
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage').then(loadModule(cb)).catch(errorLoading);
      }
    }
  ];
}
```

### LinkList component

```jsx
function LinkList({ links }) {
  return (
    <div>
      {links.map((l) => (
        <div key={l.id}>
          {l.url} - {l.description}
        </div>
      ))}
    </div>
  );
}

export default LinkList;
```

### LinkListContainer constants

```javascript
export const REQUEST_LINKS_SUCCEEDED = 'app/LinkListContainer/REQUEST_LINKS_SUCCEEDED';
export const REQUEST_LINKS_FAILED = 'app/LinkListContainer/REQUEST_LINKS_FAILED';
```

### LinkListContainer actions

```javascript
import { REQUEST_LINKS_FAILED, REQUEST_LINKS_SUCCEEDED } from './constants';

export function requestLinksSucceeded(links) {
  return {
    type: REQUEST_LINKS_SUCCEEDED,
    links
  };
}
export function requestLinksFailed(message) {
  return {
    type: REQUEST_LINKS_FAILED,
    message
  };
}
```

### ListLinkContainer reducer

```javascript
import { fromJS } from 'immutable';
import { REQUEST_LINKS_SUCCEEDED } from './constants';

const initialState = fromJS({ links: [] });

function linkListContainerReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_LINKS_SUCCEEDED:
      return state.set('links', action.links);
    default:
      return state;
  }
}

export default linkListContainerReducer;
```

### LinkListContainer saga

```javascript
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
    const links = yield call(fetchLinksFromServer, action.topic);  // passing parameter at 2nd
    // dispatch an action to store links
    yield put(requestLinksSucceeded(links));
  } catch (e) {
    // dispatch action to store error
    yield put(requestLinksFailed('failed to get data'));
  }
}

// Individual exports for testing
export function* defaultSaga() {
  yield takeLatest(SELECT_TOPIC, fetchLinks);  // listen to `SELECT_TOPIC` action and fetch data
}

// All sagas to be loaded
export default [defaultSaga];
```

### LinkListContainer wrap LinkList Component

```diff
import React from 'react';
import { connect } from 'react-redux';
import selectLinkListContainer from './selectors';
+ import LinkList from '../../components/LinkList/index';

/* eslint-disable react/prefer-stateless-function */
export class LinkListContainer extends React.Component {
  render() {
+    return <LinkList {...this.props} />;
  }
}

const mapStateToProps = selectLinkListContainer();

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkListContainer);
```

### Display LinkList in HomePage

```diff
import NavigationContainer from '../NavigationContainer/index';
+ import LinkListContainer from '../LinkListContainer/index';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <NavigationContainer />
+        <LinkListContainer />
      </div>
    );
  }
}
```