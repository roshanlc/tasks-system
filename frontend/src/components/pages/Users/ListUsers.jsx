import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import {
    Typography,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Divider,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    InputLabel,
} from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import { useFormik } from "formik"
import * as yup from "yup"
import { useContext } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import { convertDateFormat } from "../../../utils/utils"
import Appbar from "../Dashboard/Appbar"
import Task from "../Dashboard/Task/Task"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const ListUsers = () => {
    const { loginState } = useContext(LoginContext)
    const token = loginState.token

    const [userID, setUserID] = useState(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    //  selected user for displaying role while editing roles
    const [selectedUser] = useState(null)
    const [users, setUsers] = useState(null)

    const [editUser, setEditUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
    })

    // add user formik object
    const addUserFormik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            phone: "",
            dob: "",
            gender: "",
            address: "",
        },
        onSubmit: async (values) => {
            try {
                let payload = values
                // convert date into timestamp
                let timestamp = convertDateFormat(values.dob)
                payload.dob = timestamp

                await axios
                    .post(
                        `${VITE_BACKEND_URL}/users`,
                        { ...payload },
                        {
                            headers: { Authorization: `Bearer ${loginState.token}` },
                        }
                    )
                    .then((response) => {
                        if (response.status === 201) {
                            addUserFormik.resetForm()
                            toast.success(`User was added successfully.`)
                            fetchUserList()
                        }
                    })
                    .catch((err) => {
                        console.log(err) // for logging
                        if (err.response.status === 400 || err.response.status === 404) {
                            toast.warn("Please check values and try again.")
                        } else if (err.response.status === 409) {
                            toast.warn("User already exists.")
                        } else {
                            toast.warn("Something went wrong. Please try again later.")
                        }
                    })
            } catch (err) {
                console.log(err) // for logging
                toast.warn("Something went wrong. Please try again later.")
            }
        },
        validationSchema: yup.object({
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
            role: yup.string().required("Role is required"),
        }),
    })

    // for delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    // fetch list of users based on selected role
    const fetchUserList = async () => {
        axios
            .get(`${VITE_BACKEND_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setUsers(response.data)
            })
            .catch((error) => {
                
            })
    }

    // effect to auto run fetching of users
    useEffect(() => {
        fetchUserList()
    }, [])

    // edit user data
    const handleEditUser = (userId) => {
        // Find the user by ID from the filtered users list
        const user = users.find((user) => user.id === userId)
        if (user) {
            setEditUser({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                phone: user.phone || "",
                dob: user.dob || "",
                gender: user.gender || "",
                address: user.address || "",
            })
            setUserID(user.id)
            setEditDialogOpen(true)
        }
    }

    // update user details
    const handleUpdateUser = () => {
        axios
            .put(`${VITE_BACKEND_URL}/users/${userID}`, editUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                // Handle successful response
                console.log("User updated:", response.data)
                setEditDialogOpen(false)
                if (response.status === 200) {
                    toast.success("User updated successfully")
                    fetchUserList()
                } else {
                    toast.error("Error updating user")
                }
            })
            .catch((error) => {
                
                toast.error("Error updating user")
            })
    }

    const getRowsWithSerialNumber = (rows) => {
        return rows.map((row, index) => ({
            ...row,
            sn: index + 1,
            role: row.role,
        }))
    }

    const handleDeleteUser = (userId) => {
        // Find the user by ID from the filtered users list
        const user = users.find((user) => user.id === userId)
        if (user) {
            setEditUser({
                address: user.address || "",
                contactNo: user.contactNo || "",
                email: user.email || "",
                name: user.name || "",
            })
        }
        // Set the user ID to be deleted
        setUserID(userId)
        // Open the delete confirmation dialog
        setDeleteDialogOpen(true)
    }

    // delete a user
    const handleConfirmDelete = async () => {
        try {
            await axios
                .delete(`${VITE_BACKEND_URL}/users/${userID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    // Handle successful response
                    console.log("User deleted:", response.data)
                    setDeleteDialogOpen(false)
                    if (response.status === 200) {
                        toast.success("User deleted successfully")
                        fetchUserList()
                    } else {
                        toast.error("Error deleting user")
                    }
                })
                .catch((error) => {
                    
                    toast.error("Error deleting user")
                })
        } catch (error) {
            
            toast.error("Error deleting user")
        }
    }

    const handleCancelDelete = () => {
        // Close the delete confirmation dialog
        setDeleteDialogOpen(false)
    }

    // toggle for add user toggle
    const [addUserToggle, setAddUserToggle] = useState(false)


    // columns for the datagrid
    const columns = [
        { field: "sn", headerName: "SN", width: 70 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "first_name", headerName: "FName", width: 100 },
        { field: "last_name", headerName: "FName", width: 100 },
        { field: "dob", headerName: "DOB", width: 150 },
        { field: "address", headerName: "Address", width: 150 },
        { field: "phone", headerName: "Phone", width: 120 },
        { field: "role", headerName: "Role", width: 230 },
        {
            field: "action",
            headerName: "Action",
            width: 325,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{
                            marginRight: "8px",
                        }}
                        startIcon={<EditIcon />}
                        onClick={() => handleEditUser(params.row.id)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        style={{
                            marginRight: "8px",
                        }}
                        color="error"
                        startIcon={<DeleteForeverIcon />}
                        onClick={() => handleDeleteUser(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ]

    return (
        <Box>
            <Appbar/>
            <Stack direction="row" gap={1} mt={1}>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddCircleIcon />}
                    onClick={() => {
                        setAddUserToggle(true)
                    }}
                    sx={{
                        alignSelf: "center",
                        padding: 1.5,
                        margin: 1,
                        marginLeft: "auto",
                    }}
                >
                    Add Task
                </Button>
            </Stack>

            <Task/>
            <Box>
                {users == null || (users?.length === 0) ? (
                    <Typography>No users found </Typography>
                ) : (
                    <Box style={{ width: "100%" }}>
                        <DataGrid
                            rows={getRowsWithSerialNumber(users)}
                            columns={columns}
                            sortingOrder={["asc", "desc"]}
                            pageSizeOptions={[50, 100]}
                            hideFooterSelectedRowCount
                            components={{
                                Toolbar: GridToolbar,
                            }}
                        />
                    </Box>
                )}
            </Box>

            {/* Add user dialog */}
            <Dialog
                open={addUserToggle}
                onClose={() => setAddUserToggle(false)}
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle>Add new user</DialogTitle>
                <Divider />
                <DialogContent>
                    <form onSubmit={addUserFormik.handleSubmit}>
                        <Box width="100%">
                            <TextField
                                id="email"
                                name="email"
                                label="Email *"
                                type="email"
                                variant="outlined"
                                {...addUserFormik.getFieldProps("email")}
                                error={addUserFormik.touched.email && addUserFormik.errors.email}
                                helperText={addUserFormik.touched.email && addUserFormik.errors.email}
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                id="password"
                                name="password"
                                label="Password *"
                                type="password"
                                variant="outlined"
                                {...addUserFormik.getFieldProps("password")}
                                error={addUserFormik.touched.password && addUserFormik.errors.password}
                                helperText={
                                    addUserFormik.touched.password && addUserFormik.errors.password
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
                                    {...addUserFormik.getFieldProps("first_name")}
                                    error={addUserFormik.touched.first_name && addUserFormik.errors.first_name}
                                    helperText={
                                        addUserFormik.touched.first_name && addUserFormik.errors.first_name
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    id="last_name"
                                    name="last_name"
                                    label="Last Name *"
                                    type="text"
                                    variant="outlined"
                                    {...addUserFormik.getFieldProps("last_name")}
                                    error={addUserFormik.touched.last_name && addUserFormik.errors.last_name}
                                    helperText={
                                        addUserFormik.touched.last_name && addUserFormik.errors.last_name
                                    }
                                    fullWidth
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
                                    {...addUserFormik.getFieldProps("phone")}
                                    error={addUserFormik.touched.phone && addUserFormik.errors.phone}
                                    helperText={
                                        addUserFormik.touched.phone && addUserFormik.errors.phone
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    id="address"
                                    name="address"
                                    label="Address *"
                                    type="text"
                                    variant="outlined"
                                    {...addUserFormik.getFieldProps("address")}
                                    error={addUserFormik.touched.address && addUserFormik.errors.address}
                                    helperText={
                                        addUserFormik.touched.address && addUserFormik.errors.address
                                    }
                                    fullWidth
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
                                        {...addUserFormik.getFieldProps("gender")}
                                        error={addUserFormik.touched.gender && addUserFormik.errors.gender}
                                        helperText={
                                            addUserFormik.touched.gender && addUserFormik.errors.gender
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
                                    {...addUserFormik.getFieldProps("dob")}
                                    error={addUserFormik.touched.dob && addUserFormik.errors.dob}
                                    helperText={
                                        addUserFormik.touched.dob && addUserFormik.errors.dob
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                            </Stack>
                            <InputLabel id="role-label">Role</InputLabel>
                            < Select
                                labelId="role-label"
                                label="Role"
                                id="role"
                                variant="outlined"
                                {...addUserFormik.getFieldProps("role")}
                                error={addUserFormik.touched.role && addUserFormik.errors.role}
                                helperText={
                                    addUserFormik.touched.role && addUserFormik.errors.role
                                }
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value={"super_admin"}>Super Admin</MenuItem>
                                <MenuItem value={"artist"}>Artist</MenuItem>
                                <MenuItem value={"artist_manager"}>Artist Manager</MenuItem>
                            </Select>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ marginTop: 2 }}
                            >
                                <Typography sx={{ fontSize: "0.94rem" }}>
                                    Submit
                                </Typography>
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button
                        onClick={() => setAddUserToggle(false)}
                        startIcon={<CloseIcon />}
                        variant="outlined"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit user profile details dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                fullWidth
            >
                <DialogTitle>Edit User Details</DialogTitle>
                <Divider />
                <DialogContent>
                    <TextField
                        label="Email"
                        value={editUser.email}
                        onChange={(e) =>
                            setEditUser({ ...editUser, email: e.target.value })
                        }
                        fullWidth
                        margin="normal"
                    />
                    <Stack direction="row" gap={2}>
                        <TextField
                            label="FName"
                            value={editUser.first_name}
                            onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="LName"
                            value={editUser.last_name}
                            onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                    </Stack>

                    <Stack direction="row" gap={2}>
                        <TextField
                            label="Address"
                            value={editUser.address}
                            onChange={(e) =>
                                setEditUser({ ...editUser, address: e.target.value })
                            }
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Phone"
                            value={editUser.phone}
                            onChange={(e) =>
                                setEditUser({ ...editUser, phone: e.target.value })
                            }
                            fullWidth
                            margin="normal"
                        />
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button
                        onClick={handleUpdateUser}
                        color="primary"
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Update
                    </Button>
                    <Button
                        onClick={() => setEditDialogOpen(false)}
                        startIcon={<CloseIcon />}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                maxWidth={"md"}
                fullWidth
            >
                <DialogTitle>Delete User</DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack direction="column" gap={1}>
                        {selectedUser !== undefined && selectedUser !== null && (
                            <>
                                <Typography>Name: {selectedUser.name}</Typography>
                                <Typography>Email: {selectedUser.email}</Typography>

                                <Divider sx={{ marginTop: 1 }}>Assigned Roles</Divider>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Role</TableCell>
                                                <TableCell>Description</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedUser.UserRoles.map((role, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{role.role.name}</TableCell>
                                                    <TableCell>{role.role.description}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </Stack>
                    <Divider />
                    <Typography variant="h5" sx={{ m: 1 }}>
                        Are you sure you want to delete this user?
                    </Typography>
                </DialogContent>
                <Divider sx={{ marginTop: 1 }} />

                <DialogActions>
                    <Button
                        onClick={handleCancelDelete}
                        startIcon={<CloseIcon />}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        style={{
                            color: "white",
                            backgroundColor: "red",
                        }}
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}

export default ListUsers
