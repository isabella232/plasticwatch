import { fetchAuth, patchItem, fetchDispatchFactory } from '../utils';
import { apiUrl } from '../../config';
import qs from 'qs';

/*
 * List of users
 */

export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const INVALIDATE_USERS = 'INVALIDATE_USERS';

export function invalidateUsers () {
  return { type: INVALIDATE_USERS };
}

export function requestUsers () {
  return { type: REQUEST_USERS };
}

export function receiveUsers (data, error = null) {
  return {
    type: RECEIVE_USERS,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchUsers (params) {
  const searchParams = qs.stringify(params);
  return fetchAuth({
    statePath: 'users',
    url: `${apiUrl}/users?${searchParams}`,
    requestFn: requestUsers,
    receiveFn: receiveUsers
  });
}

/*
 * Fetch individual place
 */

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const INVALIDATE_USER = 'INVALIDATE_USER';

export function invalidateUser (id) {
  return { type: INVALIDATE_USER, id };
}

export function requestUser (id) {
  return { type: REQUEST_USER, id };
}

export function receiveUser (id, data, error = null) {
  return {
    type: RECEIVE_USER,
    id,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchUser (id) {
  return fetchDispatchFactory({
    statePath: ['users', 'individual', `${id}`],
    url: `${apiUrl}/users/${id}`,
    requestFn: requestUser.bind(this, id),
    receiveFn: receiveUser.bind(this, id)
  });
}

/*
 * Update individual user
 */

export const UPDATE_USER = 'UPDATE_USER';

export function updateUserAction (id, data) {
  return { type: UPDATE_USER, id, data };
}

export function updateUser (id, data) {
  return async (dispatch, getState) => {
    const state = getState();

    await patchItem(state, 'users', id, data);

    dispatch(updateUserAction(id, data));
  };
}
