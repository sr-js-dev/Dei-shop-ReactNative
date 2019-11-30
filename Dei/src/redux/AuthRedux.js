import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['form'],
  loginSuccess: ['response'],
  loginFailure: ['response'],
  getUserInfo: null,
  getUserInfoSuccess: ['response'],
  getUserInfoFailure: ['response'],
  getUserAddress: ['form'],
  getUserAddressSuccess: ['response'],
  getUserAddressFailure: ['response'],
  authFailure: null,
  logout: null
});

export const AuthTypes = Types;
export default Creators;

export const INITIAL_STATE = Immutable({
  fetching: false,
  token: null,
  user: null,
  error: null,
  posting: false,
  address: []
});

export const loginSuccess = (state, { response }) =>
  state.merge({
    posting: false,
    error: null,
    token: response.Token,
    user: response.User
  });
export const getUserInfoSuccess = (state, { response }) => state.merge({ fetching: false, error: null, user: response.User })

export const getAddressSuccess = (state, { response }) => state.merge({ address: response.Addresses })


export const postRequest = state => state.merge({ posting: true, error: null });
export const postSuccess = state =>
  state.merge({ posting: false, error: null });
export const postFailure = (state, { response }) =>
  state.merge({ posting: false, error: response });
export const request = state => state.merge({ fetching: true, error: null})
export const success = state => state.merge({ fetching: false, error: null });
export const failure = (state, { response }) => state.merge({ fetching: false, error: response });
export const logout = state => INITIAL_STATE

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: postRequest,
  [Types.LOGIN_FAILURE]: postFailure,
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.GET_USER_INFO]: request,
  [Types.GET_USER_INFO_SUCCESS]: getUserInfoSuccess,
  [Types.GET_USER_INFO_FAILURE]: failure,
  [Types.GET_USER_ADDRESS]: request,
  [Types.GET_USER_ADDRESS_SUCCESS]: getAddressSuccess,
  [Types.GET_USER_ADDRESS_FAILURE]: failure,
  [Types.AUTH_FAILURE]: failure,
  [Types.LOGOUT]: logout
});
