import { put, select, call } from 'redux-saga/effects'
import { is } from 'ramda'
import StartupActions from '../redux/StartupRedux'
import ConfigurationActions from '../redux/ConfigurationRedux'
import CartActions from '../redux/CartRedux'
import { NoInternetAlert } from '../components'


// process STARTUP actions
export function * startup (api, action) {
  let token = yield select(state => state.auth.token)
  if (token !== null) {
    api.setHeader('Authorization', 'Bearer ' + token)
  }
  const response = yield call(api.launch)

  // success?
  if (response.ok) {
    yield put(StartupActions.startupSuccess())
    yield put(ConfigurationActions.setConfiguration(response.data))
    if (token) {
      yield put(CartActions.getCart())
    }
  } else {
    yield put(StartupActions.startupFailure(response.data))
    yield put(ConfigurationActions.resetConfiguration(response.data))
    NoInternetAlert()
  }
}
