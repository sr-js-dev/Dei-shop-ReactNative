import Reactotron from 'reactotron-react-native';
import { AsyncStorage } from 'react-native';
import { reactotronRedux as reduxPlugin } from 'reactotron-redux'
import DebugConfig from './DebugConfig';
import Immutable from 'seamless-immutable'

if (DebugConfig.useReactotron) {
  Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({ name: 'Ignite App' })
  .useReactNative()
  .use(reduxPlugin({ onRestore: Immutable }))
  .connect()

  Reactotron.clear();

  console.tron = Reactotron
} else {
  const noop = () => undefined
  console.tron = {
    benchmark: noop,
    clear: noop,
    close: noop,
    configure: noop,
    connect: noop,
    display: noop,
    error: noop,
    image: noop,
    log: noop,
    logImportant: noop,
    onCustomCommand: noop,
    overlay: noop,
    reportError: noop,
    send: noop,
    startTimer: noop,
    storybookSwitcher: noop,
    use: noop,
    useReactNative: noop,
    warn: noop,
    createSagaMonitor: noop
  }
}

