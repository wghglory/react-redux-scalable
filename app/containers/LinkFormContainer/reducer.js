/*
 *
 * LinkFormContainer reducer
 *
 */

import { fromJS } from 'immutable';
import { ADD_LINK } from './constants';

const initialState = fromJS({});

function linkFormContainerReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_LINK:
      return state;
    default:
      return state;
  }
}

export default linkFormContainerReducer;
