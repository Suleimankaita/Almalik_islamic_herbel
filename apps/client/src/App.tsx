import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Layout from './layout/Layout'
import MS from "./m"
import Inventory from './pages/Inventory'
import Sale from './pages/Sale'
import ViewProducts from "./pages/ViewProducts"
const App = ():React.JSX.Element => {
  return (
    <Routes>
      <Route element={<Layout/>}>
    <Route index path='/' element={<MS/>}/>    
    <Route index path='Inventory' element={<Inventory/>} />
    <Route index path='Sales (POS)' element={<Sale/>} />
    <Route index path='View' element={<ViewProducts/>} />
      </Route>
    </Routes>
  )
}

export default App
