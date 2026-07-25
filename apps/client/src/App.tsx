import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Layout from './layout/Layout'
import MS from "./m"
import Inventory from './pages/Inventory'
import Sale from './pages/Sale'
import ViewProducts from "./pages/ViewProducts"
import PurchaseOrderForm from './pages/PurchaseOrderForm'
import Customers from './pages/Customers'
import ReportsDashboard from './pages/ReportsDashboard'
import NotificationCenter from './pages/Notification'
const App = ():React.JSX.Element => {
  return (
    <Routes>
      <Route element={<Layout/>}>
    <Route index path='/' element={<MS/>}/>    
    <Route index path='Inventory' element={<Inventory/>} />
    <Route index path='/Inventory/ViewProucts/:id' element={<ViewProducts/>} />
    <Route index path='Sales (POS)' element={<Sale/>} />
    <Route index path='Add Product' element={<PurchaseOrderForm/>} />
    <Route index path='Customers' element={<Customers/>} />
    <Route index path='Reports' element={<ReportsDashboard/>} />
    <Route index path='Notifications' element={<NotificationCenter/>} />
      </Route>
    </Routes>
  )
}

export default App
