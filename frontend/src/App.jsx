import { useContext } from "react"
import "./App.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { LoginContext } from "./store/LoginProvider"
import { useEffect } from "react"
import {
    checkTokenExpiry,
    decodeToken,
    fetchTokenFromLocalStorage,
    hasTokenInLocalStorage,
} from "./store/LoginMethods"
import { Routes } from "react-router-dom"
import LoginForm from "./components/pages/Login/LoginForm"
import { Link, Route } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import RegistrationForm from "./components/pages/Register/RegisterForm"
import Dashboard from "./components/pages/Dashboard/Dashboard"
import ResponsiveDrawer from "./components/pages/Dashboard/ResponsiveDrawer"
import ListArtists from "./components/pages/Artists/ListArtists"
import ListMusic from "./components/pages/Artists/Music"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file
const tokenValidationUrl = VITE_BACKEND_URL + "/auth/check"

export default function App() {
    const { loginState, dispatchLoginState } = useContext(LoginContext)

    /**
   * Check if the token is valid and does not expire within the next minute
   * @param {String} token
   * @returns boolean
   */
    async function validateToken(token) {
        const headers = {
            Authorization: `Bearer ${token}`,
        }

        const response = await fetch(tokenValidationUrl, {
            method: "POST",
            headers: headers,
        }).catch((error) => {
            toast.warn(
                "Your session could not be validated. Please refresh the page."
            )
            console.log(error)
            dispatchLoginState({ type: "LOGOUT_NETWORK_ISSUE" })
            return
        })

        // status code of response
        const status = await response.status

        if (status === 200) {
            const decodedToken = decodeToken(token)
            // check if expiry time is within next few mins
            // if so then remove it and ask for fresh login
            if (!checkTokenExpiry(decodedToken)) {
                // loop through roles
                const role = decodedToken.role
                dispatchLoginState({
                    type: "LOGIN",
                    payload: {
                        token: token,
                        role: role,
                    },
                })
                return
            }
        } else if (status >= 400 && status <= 599) {
            toast.warn("Your session has expired!")
            dispatchLoginState({ type: "LOGOUT" })
        }
    }

    // during page load or refresh
    // check for saved page location
    const navigate = useNavigate()
    useEffect(() => {
        // fetch path from session storage
        const pathFromSession = sessionStorage.getItem("path")
        // redirect to the last page
        if (pathFromSession !== undefined && pathFromSession !== null) {
            navigate(pathFromSession)
        }
    }, [])

    useEffect(() => {
        // if not logged in and there is a token in local storage
        // check for validity
        if (!loginState.isLogged && hasTokenInLocalStorage()) {
            validateToken(fetchTokenFromLocalStorage())
        }

        // Set up interval to check token validation every 5 minutes
        const intervalId = setInterval(() => {
            if (hasTokenInLocalStorage()) {
                validateToken(fetchTokenFromLocalStorage())
            }
        }, 5 * 60 * 1000) // 5 minutes in milliseconds

        // Clean up the interval on component unmount
        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return (
        <>
            <Routes>
                <Route path="">
                    <Route path="/" index element={<LoginForm />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <>
                                <h1>You are lost!!</h1>
                                <h3>
                                    <Link to="/">Go to login page!</Link>
                                </h3>
                            </>
                        }
                    />
                </Route>
            </Routes>

            {/* Global toast element*/}
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}
