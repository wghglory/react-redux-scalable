/*
 *
 * NavigationContainer actions
 *
 */

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
