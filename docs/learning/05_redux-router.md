# Adding Routes to your Application by react-redux-router

Before when clicking any navigation topic, we get that topic name and dispatch an `SELECT_TOPIC` action. Saga listens to the `SELECT_TOPIC` action, and based on the topic, we fetch relative data.

Now we want to use routing, so `localhost//topics/libraries` will fetch all links relative to `libraries`. So we remove listening code like below.

**LinkListContainer/sagas.js**: 不再监听点击 drawer 触发的 `SELECT_TOPIC`

```diff
- import { SELECT_TOPIC } from '../NavigationContainer/constants';
import { requestLinksFailed, requestLinksSucceeded } from './actions';

- function fetchLinksFromServer(topic) {
-   return fetch(`http://localhost:3000/api/topics/${topic.name}/links`).then((res) => res.json());
- }
-
- function* fetchLinks(action) {
-   try {
-     // fetch links based on topic
-     const links = yield call(fetchLinksFromServer, action.topic); // passing parameter at 2nd
-     // dispatch an action to store links
-     console.log('data', links);
-     yield put(requestLinksSucceeded(links));
-   } catch (e) {
-     // dispatch action to store error
-     yield put(requestLinksFailed('failed to get data'));
-   }
- }

// Individual exports for testing
export function* defaultSaga() {
-  yield takeLatest(SELECT_TOPIC, fetchLinks);
}

// All sagas to be loaded
export default [defaultSaga];
```

---

## Add routing

**HomePage/index.js**: We're not displaying LinkListContainer directly. Instead, when route maps the childRoutes, props.children will display LinkListContainer.

```diff
import React from 'react';
import NavigationContainer from '../NavigationContainer/index';
- import LinkListContainer from '../LinkListContainer/index';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <NavigationContainer />
-        <LinkListContainer />
+        {this.props.children}
      </div>
    );
  }
}
```

```
npm run generate route
? [PLOP] Please choose a generator. route - Add a route
? [ROUTE] Which component should the route show? LinkListContainer
? [ROUTE] Enter the path of the route. /topics/:topicName
[SUCCESS] modify /Users/derek/Work/react-redux-scalable/app/routes.js
```

**routes.js**: 修改默认生成的 routes

```diff
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
-          System.import('containers/LinkListContainer/reducer'),
-          System.import('containers/LinkListContainer/sagas')
        ]);

        const renderRoute = loadModule(cb);

-        importModules.then(([component, navigationReducer, navigationSagas, linkListReducer, linkListSagas]) => {
+        importModules.then(([component, navigationReducer, navigationSagas]) => {
          injectReducer('navigationContainer', navigationReducer.default);
          injectSagas('navigationContainer', navigationSagas.default);
-          injectReducer('linkListContainer', linkListReducer.default);
-          injectSagas('linkListContainer', linkListSagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
+      childRoutes: [
+        {
+          path: '/topics/:topicName',
+          name: 'linkListContainer',
+          getComponent(nextState, cb) {
+            const importModules = Promise.all([
+              System.import('containers/LinkListContainer/reducer'),
+              System.import('containers/LinkListContainer/sagas'),
+              System.import('containers/LinkListContainer')
+            ]);
+
+            const renderRoute = loadModule(cb);
+
+            importModules.then(([reducer, sagas, component]) => {
+              injectReducer('linkListContainer', reducer.default);
+              injectSagas('linkListContainer', sagas.default);
+              renderRoute(component);
+            });
+
+            importModules.catch(errorLoading);
+          }
+        }
+      ]
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

## NavigationContainer

**NavigationContainer/sagas.js**: _当点击 Navigation Topic 时，发送 push action，url 地址改变！_

```diff
import { REQUEST_TOPICS, SELECT_TOPIC, REQUEST_TOPICS_SUCCEEDED } from './constants';
import { takeLatest } from 'redux-saga';
+ import { call, put, select } from 'redux-saga/effects';
import { requestTopicsSucceeded, requestTopicsFailed } from './actions';
+ import { push } from 'react-router-redux';
+ import selectNavigationContainer from './selectors';

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

// 根据 topic name 进行 url 变换。点击 drawer 的不同 topic 触发
+ function* pushTopic(action) {
+   yield put(push(`/topics/${action.topic.name}`));
+ }

// localhost:3000 根目录时候没有 selectedTopic, 获取到第一个 topic 并改变 url
+ function* selectDefaultTopic() {
+   const state = yield select(selectNavigationContainer());  // 通过 selector 拿到状态
+   if (!state.selectedTopic) {
+     yield pushTopic({
+       topic: state.topics[0]
+     });
+   }
+ }
+

// 监听 SELECT_TOPIC
+ export function* selectTopicsSaga() {
+   yield takeLatest(SELECT_TOPIC, pushTopic);
+ }

// 监听 REQUEST_TOPICS_SUCCEEDED，成功拿到数据后可以跳转 url
+ export function* selectDefaultTopicSaga() {
+   yield takeLatest(REQUEST_TOPICS_SUCCEEDED, selectDefaultTopic);
+ }

export function* fetchTopicsSaga() {
  yield takeLatest(REQUEST_TOPICS, fetchTopics);
}

// All sagas to be loaded
+ export default [fetchTopicsSaga, selectTopicsSaga, selectDefaultTopicSaga];
```

## LinkListContainer

**LinkListContainer/selectors.js**: 如果 topicName 是随便输入的、不在数据库中。通过 selectTopic 进行处理，防止进行进一步查询 links

```diff
import { createSelector } from 'reselect';
+ import selectNavigationContainer from '../NavigationContainer/selectors';

const selectLinkListContainerDomain = () => (state) => state.get('linkListContainer');

const selectRouteTopic = () => (state, props) => props.params.topicName;

+ const selectTopic = () =>
+   createSelector(selectNavigationContainer(), selectRouteTopic(), (navigationState, routeTopicName) => {
+     const selectedTopic = navigationState.topics.find((t) => t.name === routeTopicName);
+     return selectedTopic || { name: '' };
+   });

// linkListContainer -- links -- topicName
const selectLinkListContainer = () =>
+  createSelector(selectLinkListContainerDomain(), selectTopic(), (substate, topic) => {
+    return Object.assign(substate.toJS(), { topicName: topic.name });
  });

export default selectLinkListContainer;
export { selectLinkListContainerDomain };
```

**LinkListContainer/sagas.js**:

```diff
import { take, call, put, select } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { requestLinksFailed, requestLinksSucceeded } from './actions';
+ import { REQUEST_LINKS } from './constants';

+ function fetchLinksFromServer(topicName) {
+  return fetch(`http://localhost:3000/api/topics/${topicName}/links`).then((res) => res.json());
}

function* fetchLinks(action) {
  try {
    // fetch links based on topic
+    const links = yield call(fetchLinksFromServer, action.topicName); // passing parameter at 2nd。topicName 来自 dispatch 的 action，index.js mapDispatchToProps 里面传过来的
    // dispatch an action to store links
    yield put(requestLinksSucceeded(links));
  } catch (e) {
    // dispatch action to store error
    yield put(requestLinksFailed(e.message));
  }
}

// Individual exports for testing
export function* defaultSaga() {
+  yield takeLatest(REQUEST_LINKS, fetchLinks);
}

// All sagas to be loaded
export default [defaultSaga];
```

**LinkListContainer/index.js**:

```diff
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import selectLinkListContainer from './selectors';
import LinkList from '../../components/LinkList/index';
+ import { requestLinks } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class LinkListContainer extends React.Component {
+  // 首次加载
+  componentDidMount() {
+    // where does topicName come from?
+    // 1. routes 调用相应的 saga、匹配加载当前 container,
+    // 2. mapStateToProps 调用 selector，selector 中从 route 获取到 props.params.topicName，并将其放到 state 中。mapState 到 props 中
+    this.props.requestLinks(this.props.topicName);
+  }

+  // 点击 drawer 中不同 topic，路由变化，由于路由中的 topicName props 发生发生变化而触发
+  componentWillReceiveProps(nextProps) {
+    if (nextProps.topicName !== this.props.topicName) {
+      this.props.requestLinks(nextProps.topicName);
+    }
+  }

  render() {
    return <LinkList {...this.props} />;
  }
}

const mapStateToProps = selectLinkListContainer();

function mapDispatchToProps(dispatch) {
  return {
+    requestLinks(topicName) {
+      dispatch(requestLinks(topicName));
+    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkListContainer);
```
