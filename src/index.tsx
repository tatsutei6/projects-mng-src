import './wdyr'

import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/antd.min.css'

import { AppProviders } from './context'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'
import { initDB } from './utils/utils'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
initDB().then(() => {
  root.render(
    <React.StrictMode>
        <AppProviders>
          <App />
        </AppProviders>
    </React.StrictMode>
  )
  reportWebVitals()
})
