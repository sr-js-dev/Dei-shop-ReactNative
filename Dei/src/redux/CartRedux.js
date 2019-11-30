import { createActions, createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getCart: null,
  getCartSuccess: ['response'],
  getCartFailure: ['response'],
  addProductToCart: ['form'],
  addProductToCartSuccess: ['response'],
  addProductToCartFailure: ['response'],
  removeProductFromCart: ['form'],
  removeProductFromCartSuccess: ['response'],
  removeProductFromCartFailure: ['response'],
  emptyCart: ['form'],
  emptyCartSuccess: ['response'],
  emptyCartFailure: ['response'],
  logout: null
})

export const CartTypes = Types
export default Creators

export const INITIAL_STATE = Immutable({
  fetching: false,
  posting: false,
  cart: null,
  error: null
})

export const getCartSuccess = (state, { response }) => state.merge({ fetching: false, error: null, cart: response.Cart })

export const addProductToCartSuccess = (state, { response }) => state.merge({ posting: false, error: null, cart: response.Cart })


export const postRequest = (state) => state.merge({ posting: true, error: null })
export const postSuccess = (state) => state.merge({ posting: false, error: null})
export const postFailure = (state, { response }) => state.merge({posting: false, error: response})
export const request = (state) => state.merge({ fetching: true, error: null })
export const success = (state) => state.merge({ fetching: false, error: null})
export const failure = (state, { response }) => state.merge({fetching: false, error: response})
export const logout = () => INITIAL_STATE


export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CART]: request,
  [Types.GET_CART_SUCCESS]: getCartSuccess,
  [Types.GET_CART_FAILURE]: failure,
  [Types.ADD_PRODUCT_TO_CART]: postRequest,
  [Types.ADD_PRODUCT_TO_CART_SUCCESS]: addProductToCartSuccess,
  [Types.ADD_PRODUCT_TO_CART_FAILURE]: postFailure,
  [Types.REMOVE_PRODUCT_FROM_CART]: postRequest,
  [Types.REMOVE_PRODUCT_FROM_CART_SUCCESS]: addProductToCartSuccess,
  [Types.REMOVE_PRODUCT_FROM_CART_FAILURE]: postFailure,
  [Types.EMPTY_CART]: postRequest,
  [Types.EMPTY_CART_SUCCESS]: addProductToCartSuccess,
  [Types.EMPTY_CART_FAILURE]: postFailure,
  [Types.LOGOUT]: logout
})