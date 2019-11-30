import { put, call } from 'redux-saga/effects'
import { is } from 'ramda'
import { Alert } from 'react-native';
import AuthActions from '../redux/AuthRedux'
import CartActions from '../redux/CartRedux'

export function * login (api, {form}) {
  const response = yield call(api.login, form)

  // success?
  if (response.ok) {
    yield put(AuthActions.loginSuccess(response.data))
    yield put(CartActions.getCart())
  } else {
    
    yield put(AuthActions.loginFailure())
    setTimeout(() => {
      let message = 'Login Failed - Please try again with valid credentials';
      Alert.alert('Error', message)
    }, 300)
    
  }
}


export function * getUserInfo (api) {
  const response = yield call(api.userInfo)

  // success?
  if (response.ok) {
    yield put(AuthActions.getUserInfoSuccess(response.data))
  } else {
    yield put(AuthActions.getUserInfoFailure())
  }
}

export function * getUserAddress (api, {form}) {
  const response = yield call(api.userAddresses, form)

  // success?
  if (response.ok) {
    yield put(AuthActions.getUserAddressSuccess(response.data))
  } else {
    yield put(AuthActions.getUserAddressFailure(response.data))
  }
}