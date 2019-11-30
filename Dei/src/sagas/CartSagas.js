import { put, select, call } from 'redux-saga/effects'
import { is } from 'ramda'
import CartActions from '../redux/CartRedux'

export function * getCart (api, action) {
  const response = yield call(api.cart)

  // success?
  if (response.ok) {
    yield put(CartActions.getCartSuccess(response.data))
  } else {
    yield put(CartActions.getCartFailure(response.data))
  }
}

export function * addProductToCart (api, {form}) {
  const response = yield call(api.addCartItem, form)

  // success?
  if (response.ok) {
    yield put(CartActions.addProductToCartSuccess(response.data))
  } else {
    yield put(CartActions.addProductToCartFailure(response.data))
  }
}


export function * removeProductFromCart (api, {form}) {
  const response = yield call(api.removeCartItem, form)

  // success?
  if (response.ok) {
    yield put(CartActions.removeProductFromCartSuccess(response.data))
  } else {
    yield put(CartActions.removeProductFromCartFailure(response.data))
  }
}

export function * emptyCart (api, {form}) {
  const response = yield call(api.emptyCart, form)

  // success?
  if (response.ok) {
    yield put(CartActions.emptyCartSuccess(response.data))
  } else {
    yield put(CartActions.emptyCartFailure(response.data))
  }
}
