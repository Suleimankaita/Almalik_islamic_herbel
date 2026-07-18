import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Layout from './layout/Layout'
import MS from "./m"
const App = ():React.JSX.Element => {
  return (
    <Routes>
      <Route element={<Layout/>}>
    <Route index path='/' element={<MS/>}/>    
      </Route>
    </Routes>
  )
}

export default App
