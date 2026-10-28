import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import DashboardHome from './m'
import Inventory from './pages/Inventory'
import Sale from './pages/Sale'
import ViewProducts from './pages/ViewProducts'
import PurchaseOrderForm from './pages/PurchaseOrderForm'
import NotificationCenter from './pages/Notification'
import SettingsPage from './pages/Settings'
import NotFound from './pages/Not_found'
import Login from './pages/AlmalikAuthScreen'
import PersistLogin from './Features/Persistance'
import Loader from "./components/Loader"
import UsersRoles from './pages/UsersRoles'
import ComingSoon from './components/ComingSoon'
import RoleRoute from './components/RoleRoute'
import { Navigate } from 'react-router-dom'
import ProductSearch from './pages/ProductSearch'
import SalesHistory from './pages/SalesHistory'
const App = (): React.JSX.Element => {

return (
    <Routes>
      <Route path='/login' element={<Login />} />

    <Route element={<PersistLogin />}>
      <Route element={<Layout />}>
        <Route element={<RoleRoute />}>

        <Route path='/' element={<DashboardHome />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/search' element={<ProductSearch />} />
        <Route path='/Loading' element={<Loader    />} />
        <Route path='/ma' element={<ComingSoon title="Manager dashboard" />} />
        <Route path='/inventory/view-products/:id' element={<ViewProducts />} />
        <Route path='/sales-pos' element={<Sale />} />
        <Route path='/Sales (POS)' element={<Navigate to="/sales-pos" replace />} />
        <Route path='/sales-history' element={<SalesHistory />} />
        <Route path='/add product' element={<PurchaseOrderForm />} />
        <Route path='/customers' element={<ComingSoon title="Customers" />} />
        <Route path='/notifications' element={<NotificationCenter />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/reports' element={<ComingSoon title="Reports & analytics" />} />
        <Route path='/expenses' element={<ComingSoon title="Expense management" />} />
        <Route path='/users-and-roles' element={<UsersRoles />} />
        <Route path='/suppliers' element={<ComingSoon title="Suppliers" />} />
        <Route path='/purchase' element={<ComingSoon title="Purchase orders" />} />
        <Route path='/messages' element={<ComingSoon title="Messages" />} />
        <Route path='/Users & Roles' element={<UsersRoles />} />     
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>

    </Routes>
  )
}

export default App
