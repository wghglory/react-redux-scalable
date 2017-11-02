import { createSelector } from 'reselect';

/**
 * Direct selector to the loginContainer state domain
 */
const selectLoginContainerDomain = () => (state) => state.get('loginContainer');

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginContainer
 */

// 首次访问调用了 NavigationContainer，NavigationContainer selector 引用了本 selector，去获得 login 信息
// 此时还没登录，loginContainer reducer 还没执行，substate 是空，所以如下处理
const selectLoginContainer = () =>
  createSelector(selectLoginContainerDomain(), (substate) => (substate ? substate.toJS() : {}));

export default selectLoginContainer;
export { selectLoginContainerDomain };
