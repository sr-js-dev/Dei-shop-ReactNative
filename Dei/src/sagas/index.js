import { takeLatest, all } from 'redux-saga/effects';
import API from '../services/Api';

/* ------------- Types ------------- */

import { StartupTypes } from '../redux/StartupRedux';
import { AuthTypes } from '../redux/AuthRedux';
import { CartTypes } from '../redux/CartRedux';

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas';
import { login, getUserInfo, getUserAddress } from './AuthSagas';
import {
  getCart,
  addProductToCart,
  removeProductFromCart,
  emptyCart
} from './CartSagas';

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP_REQUEST, startup, api),

    // auth
    takeLatest(AuthTypes.LOGIN_REQUEST, login, api),
    takeLatest(AuthTypes.GET_USER_INFO, getUserInfo, api),
    takeLatest(AuthTypes.LOGOUT, startup, api),
    takeLatest(AuthTypes.GET_USER_ADDRESS, getUserAddress, api),

    // cart
    takeLatest(CartTypes.GET_CART, getCart, api),
    takeLatest(CartTypes.EMPTY_CART, emptyCart, api),
    takeLatest(CartTypes.ADD_PRODUCT_TO_CART, addProductToCart, api),
    takeLatest(CartTypes.REMOVE_PRODUCT_FROM_CART, removeProductFromCart, api),
    
  ]);
}
