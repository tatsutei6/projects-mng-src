import './wdyr'

import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/antd.min.css'
import { Provider } from 'react-redux'

import { AppProviders } from './context'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'
import { store } from './store'
import { initDB } from './utils/utils'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
initDB().then(() => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <AppProviders>
          <App />
        </AppProviders>
      </Provider>
    </React.StrictMode>
  )
  reportWebVitals()
})
