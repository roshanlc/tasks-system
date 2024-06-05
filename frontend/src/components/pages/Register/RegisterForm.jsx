
// LoginForm.jsx
import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Link,
    Stack,
    Select,
    InputLabel,
    MenuItem,
} from "@mui/material"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import LoginIcon from "@mui/icons-material/Login"
import { convertDateFormat } from "../../../utils/utils"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

/**
 * LoginForm Component
 */
const RegistrationForm = () => {
    const { loginState, dispatchLoginState } = useContext(LoginContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (loginState.isLogged) {
            navigate("/dashboard")
        }
    }, [loginState.isLogged])

    // initial values for registration form
    const initialValues = {
        email: "",
        password: "",
        role: "",
        first_name: "",
        last_name: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
    }

    const [loginError, setLoginError] = useState("")
    const [registerSuccess, setRegisterSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const onSubmit = async (values) => {
        let payload = values

        // set role as super_admin
        payload.role = "super_admin"
        // convert date into timestamp
        let timestamp = convertDateFormat(values.dob)
        payload.dob = timestamp

        setLoading(true)
        setLoginError("")
        setRegisterSuccess("")

        try {
            const response = await fetch(`${VITE_BACKEND_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            }).catch((err) => console.log(err))

            if (response.ok) {
                // Login success
                setRegisterSuccess("Registration successful!")

                toast.success("Registration successful!")

                toast.success("Redirecting to login page...")
                // wait for 500 milliseconds and redirect to login page
                await new Promise((resolve) => setTimeout(resolve, 500))
                // navigate to login page
                navigate("/")

            } else if (response.status === 400) {
                const data = await response.json()
                // 401 : Invalid credentails
                setLoginError(data.error.message || "Please try again")
                // send toast
                toast.error(data.error.message || "Please try again")
            } else {
                console.error("Registration failed:", response)
                setLoginError("An error occurred during registration. Please try again.")
                toast.error("An error occurred during registration. Please try again.")
            }
        } catch (err) {
            console.error("Registration failed:", err) // Most probably, network problem
            setLoginError("An error occurred during registration. Please try again.")
            toast.error("An error occurred during registration. Please try again.")
        }

        setLoading(false)
    }

    const validationSchema = yup.object({
        email: yup
            .string()
            .email("Please enter a valid email address")
            .required("Email field is required"),
        password: yup
            .string()
            .min(5, "The minimum length of Password is 6 characters")
            .required("Password field is required"),
        first_name: yup.string().required("First name is required"),
        last_name: yup.string().required("Last name is required"),
        phone: yup.string().min(10).max(10).required("Phone number is required"),
        dob: yup.date().required("Date of birth is required"),
        gender: yup.string().oneOf(["m", "f", "o"]).required("Gender is required"),
        address: yup.string().required("Address is required"),
    })
    // role: yup
    //   .string().
    //   oneOf(["super_admin", "artist_manager", "artist"])
    //   .required("Role is required"),

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
    })

    return (
        <>
            <Box //main container-outer
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                fontFamily={{
                    fontFamily: [
                        "-apple-system",
                        "BlinkMacSystemFont",
                        '"Segoe UI"',
                        "Roboto",
                        '"Helvetica Neue"',
                        "Arial",
                        "sans-serif",
                        '"Apple Color Emoji"',
                        '"Segoe UI Emoji"',
                        '"Segoe UI Symbol"',
                    ].join(","),
                }}
            >
                <Box
                    color="black" //box component inside outer container
                    width="100%"
                    textAlign="center"
                    sx={{ marginTop: 2, marginBottom: 10 }}
                >
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="h3">Artist Dashboard - Cloco Nepal Assignment</Typography>
                        <Box marginTop={1}>
                            <Typography variant="h8">
                Sign in with your email and password
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexGrow={1}
                    width="100%"
                >
                    <Paper
                        variant="elevation"
                        elevation={2}
                        sx={{
                            padding: 5,
                            borderRadius: 1,
                            paddingBottom: 3,
                            boxShadow: 5,
                        }}
                    >
                        <form onSubmit={formik.handleSubmit}>
                            <Box maxWidth={500} width="100%">
                                <Typography variant="h4" align="center" gutterBottom>
                                    <LoginIcon /> Register
                                </Typography>

                                <TextField
                                    id="email"
                                    name="email"
                                    label="Email *"
                                    type="email"
                                    variant="outlined"
                                    {...formik.getFieldProps("email")}
                                    error={formik.touched.email && formik.errors.email}
                                    helperText={formik.touched.email && formik.errors.email}
                                    fullWidth
                                    margin="normal"
                                />

                                <TextField
                                    id="password"
                                    name="password"
                                    label="Password *"
                                    type="password"
                                    variant="outlined"
                                    {...formik.getFieldProps("password")}
                                    error={formik.touched.password && formik.errors.password}
                                    helperText={
                                        formik.touched.password && formik.errors.password
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                                <Stack direction="row" gap={1}>
                                    < TextField
                                        id="first_name"
                                        name="first_name"
                                        label="First Name *"
                                        type="text"
                                        variant="outlined"
                                        {...formik.getFieldProps("first_name")}
                                        error={formik.touched.first_name && formik.errors.first_name}
                                        helperText={
                                            formik.touched.first_name && formik.errors.first_name
                                        }
                                        // fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        id="last_name"
                                        name="last_name"
                                        label="Last Name *"
                                        type="text"
                                        variant="outlined"
                                        {...formik.getFieldProps("last_name")}
                                        error={formik.touched.last_name && formik.errors.last_name}
                                        helperText={
                                            formik.touched.last_name && formik.errors.last_name
                                        }
                                        // fullWidth
                                        margin="normal"
                                    />
                                </Stack>
                                <Stack direction="row" gap={1}>
                                    < TextField
                                        id="phone"
                                        name="phone"
                                        label="Phone *"
                                        type="text"
                                        variant="outlined"
                                        {...formik.getFieldProps("phone")}
                                        error={formik.touched.phone && formik.errors.phone}
                                        helperText={
                                            formik.touched.phone && formik.errors.phone
                                        }
                                        // fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        id="address"
                                        name="address"
                                        label="Address *"
                                        type="text"
                                        variant="outlined"
                                        {...formik.getFieldProps("address")}
                                        error={formik.touched.address && formik.errors.address}
                                        helperText={
                                            formik.touched.address && formik.errors.address
                                        }
                                        // fullWidth
                                        margin="normal"
                                    />
                                </Stack>

                                <Stack direction="row" gap={1}>
                                    <Box>

                                        <InputLabel id="gender-label">Gender</InputLabel>
                                        < Select
                                            labelId="gender-label"
                                            label="Gender"
                                            id="gender"
                                            variant="outlined"
                                            {...formik.getFieldProps("gender")}
                                            error={formik.touched.gender && formik.errors.gender}
                                            helperText={
                                                formik.touched.gender && formik.errors.gender
                                            }
                                            fullWidth
                                            margin="normal"
                                        >
                                            <MenuItem value={'m'}>Male</MenuItem>
                                            <MenuItem value={'f'}>Female</MenuItem>
                                            <MenuItem value={'o'}>Other</MenuItem>
                                        </Select>
                                    </Box>
                                    <TextField
                                        id="dob"
                                        name="dob"
                                        label="Date of Birth (YYYY-MM-DD)*"
                                        variant="outlined"
                                        {...formik.getFieldProps("dob")}
                                        error={formik.touched.dob && formik.errors.dob}
                                        helperText={
                                            formik.touched.dob && formik.errors.dob
                                        }
                                        fullWidth
                                        margin="normal"
                                    />
                                </Stack>


                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={loading}
                                    sx={{ marginTop: 2 }}
                                >
                                    <Typography sx={{ fontSize: "0.94rem" }}>
                                        {loading ? "Logging in..." : "Submit"}
                                    </Typography>
                                </Button>

                                {loginError && (
                                    <Typography
                                        sx={{ marginTop: 1 }}
                                        color="error"
                                        align="center"
                                        paragraph
                                    >
                                        {loginError}
                                    </Typography>
                                )}

                                {registerSuccess && (
                                    <Typography
                                        sx={{ marginTop: 2 }}
                                        color="green"
                                        align="center"
                                        paragraph
                                    >
                                        {registerSuccess}
                                    </Typography>
                                )}
                            </Box>
                        </form>
                        <Stack direction="row" sx={{ marginTop: 3 }}>
                            <Link
                                href="#"
                                underline="hover"
                                title="Click here to login"
                                onClick={() => navigate("/")}
                            >
                                <Typography sx={{ fontSize: "1rem" }}>
                  Take me to Login
                                </Typography>
                            </Link>

                        </Stack>

                    </Paper>
                </Box>
            </Box>
        </>
    )
}

export default RegistrationForm
