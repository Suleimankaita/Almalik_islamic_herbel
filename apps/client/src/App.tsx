import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import DashboardHome from './m'
import Inventory from './pages/Inventory'
import Sale from './pages/Sale'
import ViewProducts from './pages/ViewProducts'
import PurchaseOrderForm from './pages/PurchaseOrderForm'
import Customers from './pages/Customers'
import ReportsDashboard from './pages/ReportsDashboard'
import NotificationCenter from './pages/Notification'
import SettingsPage from './pages/Settings'
import ExpenseHistory from './pages/ExpenseHistory'
import UsersAndRolesPage from './pages/UsersAndRoles'
import SuppliersPage from './pages/Supplies'
import NotFound from './pages/Not_found'
import Login from './pages/AlmalikAuthScreen'
import Manager from './components/ManagerDash'
import PersistLogin from './Features/Persistance'
import Loader from "./components/Loader"
import UsersRoles from './pages/UsersRoles'
const App = (): React.JSX.Element => {

return (
    <Routes>
      <Route path='/login' element={<Login />} />

       <Route element={<PersistLogin />}>
      <Route element={<Layout />}>

        <Route path='/' element={<DashboardHome />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/Loading' element={<Loader    />} />
        <Route path='/ma' element={<Manager />} />
        <Route path='/inventory/view-products/:id' element={<ViewProducts />} />
        <Route path='/Sales (POS)' element={<Sale />} />
        <Route path='/add product' element={<PurchaseOrderForm />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/reports' element={<ReportsDashboard />} />
        <Route path='/notifications' element={<NotificationCenter />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/expenses' element={<ExpenseHistory />} />
        <Route path='/users-and-roles' element={<UsersAndRolesPage />} />
        <Route path='/suppliers' element={<SuppliersPage />} />     
        <Route path='/Users & Roles' element={<UsersRoles />} />     
      </Route>
       </Route>

    <Route path="*" element={<NotFound/>} />

    </Routes>
  )
}

export default App
