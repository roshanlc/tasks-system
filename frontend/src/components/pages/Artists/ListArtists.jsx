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
import PreviewIcon from '@mui/icons-material/Preview'
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
import { Link } from "react-router-dom"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const ListArtists = () => {
    const { loginState } = useContext(LoginContext)
    const token = loginState.token

    const [userID, setUserID] = useState(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    //  selected user for displaying role while editing roles
    const [selectedUser] = useState(null)
    const [users, setUsers] = useState(null)

    // state for editing artist detail
    const [editUser, setEditUser] = useState({
        name: "",
        dob: "",
        gender: "",
        address: "",
        first_release_year: "",
        no_of_albums_released: 0,
    })

    // add user formik object
    const addArtistFormik = useFormik({
        initialValues: {
            name: "",
            dob: "",
            gender: "",
            address: "",
            first_release_year: "",
            no_of_albums_released: 0,

        },
        onSubmit: async (values) => {
            try {
                let payload = values
                // convert date into timestamp
                let timestamp = convertDateFormat(values.dob)
                payload.dob = timestamp
                if (payload.first_release_year == "") {
                    // remove the key if empty
                    delete payload.first_release_year
                }

                payload.no_of_albums_released = parseInt(payload.no_of_albums_released) || 0

                await axios
                    .post(
                        `${VITE_BACKEND_URL}/artists`,
                        { ...payload },
                        {
                            headers: { Authorization: `Bearer ${loginState.token}` },
                        }
                    )
                    .then((response) => {
                        if (response.status === 201) {
                            addArtistFormik.resetForm()
                            toast.success(`Artist was added successfully.`)
                            fetchArtistList()
                        }
                    })
                    .catch((err) => {
                        console.log(err) // for logging
                        if (err.response.status === 400 || err.response.status === 404) {
                            toast.warn("Please check values and try again.")
                        } else if (err.response.status === 409) {
                            toast.warn("Artist already exists.")
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
            name: yup.string().required("Name is required"),
            dob: yup.date().required("Date of birth is required"),
            gender: yup.string().oneOf(["m", "f", "o"]).required("Gender is required"),
            address: yup.string().required("Address is required"),
            first_release_year: yup.date().optional(),
            no_of_albums_released: yup.number().required("Total albums released is required"),
        }),
    })

    // for delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    // fetch list of artists
    const fetchArtistList = async () => {
        axios
            .get(`${VITE_BACKEND_URL}/artists`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setUsers(response.data)
            })
            .catch((error) => {
                console.error("Error fetching artists:", error)
            })
    }

    // effect to auto run fetching of users
    useEffect(() => {
        fetchArtistList()
    }, [])

    // edit user data
    const handleEditUser = (userId) => {
    // Find the user by ID from the filtered users list
        const user = users.find((user) => user.id === userId)
        if (user) {
            setEditUser({
                name: user.name || "",
                dob: user.dob || "",
                gender: user.gender || "",
                address: user.address || "",
                first_release_year: user.first_release_year || "",
                no_of_albums_released: user.no_of_albums_released || 0,
            })
            setUserID(user.id)
            setEditDialogOpen(true)
        }
    }

    // update user details
    const handleUpdateUser = () => {
    // make some changes to payload
        let payload = editUser
        if (payload.first_release_year == "" || payload.first_release_year == "0001-01-01T00:00:00Z") {
            delete payload.first_release_year
        } else {
            payload.first_release_year = convertDateFormat(payload.first_release_year)
        }
        payload.no_of_albums_released = parseInt(payload.no_of_albums_released) || 0
        if (payload.no_of_albums_released < 0) {
            toast.warn("Total albums cannot be negative")
            return
        }

        axios
            .put(`${VITE_BACKEND_URL}/artists/${userID}`, payload, {
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
                    fetchArtistList()
                } else {
                    toast.error("Error updating user")
                }
            })
            .catch((error) => {
                console.error("Error updating user:", error)
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
                .delete(`${VITE_BACKEND_URL}/artists/${userID}`, {
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
                        fetchArtistList()
                    } else {
                        toast.error("Error deleting user")
                    }
                })
                .catch((error) => {
                    console.error("Error deleting user:", error)
                    toast.error("Error deleting user")
                })
        } catch (error) {
            console.error("Error deleting user:", error)
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
        { field: "name", headerName: "Name", width: 200 },
        { field: "dob", headerName: "DOB", width: 180 },
        { field: "gender", headerName: "Gender", width: 80 },
        { field: "first_release_year", headerName: "First Release Yr", width: 150 },
        { field: "no_of_albums_released", headerName: "Total Albums", width: 150 },
        { field: "address", headerName: "Address", width: 150 },
        {
            field: "action",
            headerName: "Action",
            width: 380,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="outlined"
                        color="success"
                        style={{
                            marginRight: "8px",
                        }}
                        startIcon={<PreviewIcon />}
                    >
                        <Link to={`/artists/${params.row.id}/music`}>
              View Music
                        </Link>
                    </Button>
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
            <Stack direction="row" gap={1}>
                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => {
                        setAddUserToggle(true)
                    }}
                    sx={{
                        alignSelf: "center",
                        padding: 1,
                        margin: 1,
                        marginLeft: "auto",
                    }}
                >
          Add Artist
                </Button>
            </Stack>
            <Box>
                {users == null || (users?.length === 0) ? (
                    <Typography>No artists found </Typography>
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

            {/* Add artist dialog */}
            <Dialog
                open={addUserToggle}
                onClose={() => setAddUserToggle(false)}
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle>Add new artist</DialogTitle>
                <Divider />
                <DialogContent>
                    <form onSubmit={addArtistFormik.handleSubmit}>
                        <Box width="100%">
                            < TextField
                                id="name"
                                name="name"
                                label="Name *"
                                type="text"
                                variant="outlined"
                                {...addArtistFormik.getFieldProps("name")}
                                error={addArtistFormik.touched.name && addArtistFormik.errors.name}
                                helperText={
                                    addArtistFormik.touched.name && addArtistFormik.errors.name
                                }
                                fullWidth
                                margin="normal"
                            />
                            <Stack direction="row" gap={1}>
                                <TextField
                                    id="address"
                                    name="address"
                                    label="Address *"
                                    type="text"
                                    variant="outlined"
                                    {...addArtistFormik.getFieldProps("address")}
                                    error={addArtistFormik.touched.address && addArtistFormik.errors.address}
                                    helperText={
                                        addArtistFormik.touched.address && addArtistFormik.errors.address
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
                                        {...addArtistFormik.getFieldProps("gender")}
                                        error={addArtistFormik.touched.gender && addArtistFormik.errors.gender}
                                        helperText={
                                            addArtistFormik.touched.gender && addArtistFormik.errors.gender
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
                                    {...addArtistFormik.getFieldProps("dob")}
                                    error={addArtistFormik.touched.dob && addArtistFormik.errors.dob}
                                    helperText={
                                        addArtistFormik.touched.dob && addArtistFormik.errors.dob
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                            </Stack>
                            <Stack direction="row" gap={1}>
                                <TextField
                                    id="first_release_year"
                                    name="first_release_year"
                                    label="First Release Year *"
                                    type="text"
                                    variant="outlined"
                                    {...addArtistFormik.getFieldProps("first_release_year")}
                                    error={addArtistFormik.touched.first_release_year && addArtistFormik.errors.first_release_year}
                                    helperText={
                                        addArtistFormik.touched.first_release_year && addArtistFormik.errors.first_release_year
                                    }
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    id="no_of_albums_released"
                                    name="no_of_albums_released"
                                    label="Total albums released *"
                                    type="number"
                                    variant="outlined"
                                    {...addArtistFormik.getFieldProps("no_of_albums_released")}
                                    error={addArtistFormik.touched.no_of_albums_released && addArtistFormik.errors.no_of_albums_released}
                                    helperText={
                                        addArtistFormik.touched.no_of_albums_released9 && addArtistFormik.errors.no_of_albums_released
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
                        label="Name"
                        value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Address"
                        value={editUser.address}
                        onChange={(e) =>
                            setEditUser({ ...editUser, address: e.target.value })
                        }
                        fullWidth
                        margin="normal"
                    />
                    <Stack direction="row" gap={1}>
                        <TextField
                            label="First Release Year *"
                            type="text"
                            fullWidth
                            margin="normal"
                            value={editUser.first_release_year}
                            onChange={(e) =>
                                setEditUser({ ...editUser, first_release_year: e.target.value })
                            }
                        />
                        <TextField
                            id="no_of_albums_released"
                            name="no_of_albums_released"
                            label="Total albums released *"
                            type="number"
                            fullWidth
                            value={editUser.no_of_albums_released}
                            margin="normal"
                            onChange={(e) =>
                                setEditUser({ ...editUser, no_of_albums_released: e.target.value })
                            }
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

export default ListArtists
