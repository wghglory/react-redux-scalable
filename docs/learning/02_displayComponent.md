# Display Navigation component in HomePage container

We want to display Navigation component in HomePage.

Step 1: Add some thing to be displayed in Navigation Presentational Component.

```jsx
import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

function Navigation({ topics }) {
  return <div className={styles.navigation}>We have {topics.length} topics</div>;
}

Navigation.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Navigation;
```

Step 2: Embed Presentational into another "Presentational Container"...

```jsx
/*
 *
 * NavigationContainer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectNavigationContainer from './selectors';
import Navigation from '../../components/Navigation/index';

/* eslint-disable react/prefer-stateless-function */
// here NavigationContainer is still a presentational component.
// Actually can replace it with components/Navigation.
export class NavigationContainer extends React.Component {
  render() {
    return <Navigation {...this.props} />;
  }
}

const mapStateToProps = selectNavigationContainer();

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationContainer);  // return a true container
```

Step 3: use container component in HomePage

```jsx
import NavigationContainer from '../NavigationContainer/index';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.Component {
  render() {
    return (
      <h1>
        <NavigationContainer />
      </h1>
    );
  }
}
```

If running the app now, you will see an error:

`toJS()` is undefined because store doesn't return that state in NavigationContainer/selectors.js:

```jsx
const selectNavigationContainer = () => createSelector(
  selectNavigationContainerDomain(),
  (substate) => substate.toJS()
);
```

Step 4: to fix this, modify routes.js

```diff
export default function createRoutes(store) {
  return [
    {
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage'),
+          System.import('containers/NavigationContainer/reducer'),
+          System.import('containers/NavigationContainer/sagas')
        ]);

        const renderRoute = loadModule(cb);

+        importModules.then(([component, reducer, sagas]) => {
+          injectReducer('navigationContainer', reducer.default);
+          injectSagas('navigationContainer', sagas.default);
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

---

We can add some initial State in the reducer so we have some data to display.

```javascript
/*
 *
 * NavigationContainer reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION } from './constants';

const initialState = fromJS({
  topics: [
    {
      name: 'libraries',
      description: 'links to useful open source libraries'
    },
    {
      name: 'apps',
      description: 'links to new and exciting apps'
    },
    {
      name: 'news',
      description: 'links to programming related news articles'
    }
  ]
});

function navigationContainerReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default navigationContainerReducer;
```