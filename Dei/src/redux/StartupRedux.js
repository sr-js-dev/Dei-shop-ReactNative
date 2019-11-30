import { createActions, createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startupRequest: null,
  startupSuccess: ['response'],
  startupFailure: ['response']
})

export const StartupTypes = Types
export default Creators

export const INITIAL_STATE = Immutable({
  success: false,
  error: null
})


export const request = (state) => state.merge({ success: false, error: null })
export const success = (state) => state.merge({success: true})
export const failure = (state, { response }) => state.merge({success: false, error: response})
export const startupSuccess = (state, { response }) => state.merge({
  success: true,
  error: null
})


export const reducer = createReducer(INITIAL_STATE, {
  [Types.STARTUP_REQUEST]: request,
  [Types.STARTUP_SUCCESS]: startupSuccess,
  [Types.STARTUP_FAILURE]: failure,
})