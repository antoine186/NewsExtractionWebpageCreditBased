import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from '../containers/Login'
import { registerRootComponent } from 'expo'
import { store, persistor } from '../store/Store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import AccountCreationPage from '../containers/AccountCreationPage'
import PaymentPage from '../containers/PaymentPage'
import Completion from '../components/atoms/Completion'
import SessionController from '../components/atoms/SessionController'
import ForgotPasswordPage from '../containers/ForgotPasswordPage'
import PasswordResetPage from '../containers/PasswordResetPage'
import LandingSwitchingPage from '../containers/LandingSwitchingPage'

function App () {
  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <React.StrictMode>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<LandingSwitchingPage />} />
                        <Route index element={<LandingSwitchingPage />} />
                        <Route path="login" element={<Login />} />
                        <Route path="account-create" element={<AccountCreationPage />}/>
                        <Route path="payment" element={<PaymentPage />} />
                        <Route path="completion" element={<Completion />}/>
                        <Route path="forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="reset-password" element={<PasswordResetPage />} />
                    </Routes>
                </HashRouter>
            </React.StrictMode>
        </PersistGate>
        <SessionController />
    </Provider>
  )
}

export default registerRootComponent(App)
