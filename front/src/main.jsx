import React from 'react'
import ReactDOM from 'react-dom/client'
import {Reducer} from './redux/Reducer.js'
import App from './App.jsx'
import{ legacy_createStore as createStore} from "redux"
import { Provider} from 'react-redux'

const store = createStore(Reducer)
ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>
)
