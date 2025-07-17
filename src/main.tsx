import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Landing from './routes/Landing.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout.tsx'
import ErrorRoute from './routes/ErrorRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<Landing />} index />
          <Route element={<ErrorRoute />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)