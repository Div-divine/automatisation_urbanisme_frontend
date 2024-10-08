import React from 'react'
import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './route/Router'

function App() {
  
  return (
    <RouterProvider router={router} />
  )
}

export default App
