import { ReactNode } from 'react'
import { AuthProvider } from './AuthContext'
import { store } from '../store'
import { Provider } from 'react-redux'

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>
    <AuthProvider>{children}</AuthProvider>
  </Provider>
}
