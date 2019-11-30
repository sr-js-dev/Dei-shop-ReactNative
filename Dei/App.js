import React, { Component } from 'react';
import PrimaryNavigation from './src/navigation/PrimaryNavigation';
import { Provider } from 'react-redux'
import createStore from './src/redux'

// create our store
const store = createStore()

class App extends Component {
  state = {};
  render() {
    return <Provider store={store}>
      <PrimaryNavigation />
      </Provider>;
  }
}

export default App;
