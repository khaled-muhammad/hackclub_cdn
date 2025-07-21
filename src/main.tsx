import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from './routes/Landing.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout.tsx'
import ErrorRoute from './routes/ErrorRoute.tsx'
import AuthRoute from './routes/AuthRoute.tsx'
import SetNewPasswordRoute from './routes/SetNewPasswordRoute.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import AuthSession from './routes/AuthSession.tsx'
import Dashboard from './routes/Dashboard.tsx'

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route element={<Landing />} index />
            <Route 
              path='/auth' 
              element={
                <ProtectedRoute requireAuth={false}>
                  <AuthRoute />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/auth/set_new_password' 
              element={
                <ProtectedRoute requireAuth={false}>
                  <SetNewPasswordRoute />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/auth/auth_session' 
              element={
                <ProtectedRoute requireAuth={false}>
                  <AuthSession />
                </ProtectedRoute>
              } 
            />
            <Route element={<ErrorRoute />} path="*" />
          </Route>
          <Route path='/dashboard' element={<Dashboard />}>
          </Route>
        </Routes>
        
        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
)