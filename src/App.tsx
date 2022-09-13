import './App.css'
import React from 'react'
import { useAuth } from './context/AuthContext'
import ProjectListPage from './views/ProjectList/ProjectListPage'
import { ErrorBoundary } from 'react-error-boundary'
import { FullPageErrorFallback} from './components/Others/Others'
import { LoginPage } from './views/Login/LoginPage'

function App() {
  const { user } = useAuth()

  return (
    <div className='App'>
      <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
        {user ? <ProjectListPage /> : <LoginPage />}
      </ErrorBoundary>
    </div>
  )
}

export default App
