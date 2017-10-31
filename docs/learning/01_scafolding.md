# using scaffolding to generate components

## generate a navigation component

```bash
npm run generate component
```

```
? [COMPONENT] Select the type of component Stateless Function
? [COMPONENT] What should it be called? Navigation
? [COMPONENT] Does it have styling? Yes
? [COMPONENT] Do you want i18n messages (i.e. will this component use text)? No
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/components/Navigation/index.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/components/Navigation/tests/index.test.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/components/Navigation/styles.css
```

```bash
npm run generate container
```

```
? [CONTAINER] What should it be called? NavigationContainer
? [CONTAINER] Do you want headers? No
? [CONTAINER] Does it have styling? No
? [CONTAINER] Do you want an actions/constants/selectors/reducer tupel for this container? Yes
? [CONTAINER] Do you want sagas for asynchronous flows? (e.g. fetching data) Yes
? [CONTAINER] Do you want i18n messages (i.e. will this component use text)? No
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/index.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/tests/index.test.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/actions.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/tests/actions.test.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/constants.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/selectors.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/tests/selectors.test.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/reducer.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/tests/reducer.test.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/sagas.js
[SUCCESS] add /Users/derek/Work/react-redux-scalable/app/containers/NavigationContainer/tests/sagas.test.js
```

Now we can see 2 folders: app/components/Navigation, app/containers/NavigationContainer.