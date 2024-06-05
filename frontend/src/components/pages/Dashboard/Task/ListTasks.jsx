import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import {
    Typography,
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
    Pagination,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import { useContext } from "react"
import { LoginContext } from "../../../../store/LoginProvider"
import Appbar from "../Appbar"
import Task from "./Task"
import AddTask from "./AddTask"
import useTasks from "../../../hooks/useTasks"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const ListTaks = () => {
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

    const [currentPage, setCurrentPage] = useState(1) // current page in pagination
    const [totalPages, setTotalPages] = useState(1)

    const [tasks, setTasks] = useState(null)
    const { isLoading, error, data, refetch } = useTasks(currentPage)

    // call for refetch when current page is changed
    useEffect(() => {
        refetch() // refetch the tasks
    }, [currentPage, refetch])

    // change the tasks data
    useEffect(() => {
        if (data !== undefined && data !== null) {
            setTotalPages(data.metadata.total_pages || 1)
            // set the tasks here
            setTasks(data.data)
        }
    }, [data])


    // for delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)


    // edit user data

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
            .catch(() => {

                toast.error("Error updating user")
            })
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
                .catch(() => {

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



    return (
        <Box>
            <Appbar />
            <Stack direction="row" gap={2} mt={1}>
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
                        // marginLeft: "auto",
                    }}
                >
                    Add Task
                </Button>
            </Stack>
            {/* list tasks here */}
            {isLoading ? (
                <p>Loading tasks...</p>
            ) : error ? (
                <p>Error fetching tasks: {error.message}</p>
            ) : (
                <Stack direction="column" gap={2} mt={1}>
                    {tasks !== undefined && tasks !== null && tasks.map((item, id) => (
                        <Task key={id} task={item} />
                    ))}
                </Stack>
            )}
            <Pagination count={totalPages} defaultPage={1} page={currentPage} shape="rounded"
                variant="outlined" color="primary" sx={{ margin: 1, padding: 1 }}
                onChange={(e, pageValue) => {
                    // set the clicked page to current page value 
                    setCurrentPage(pageValue)
                }} />
            {/* Add task dialog */}
            <AddTask dialogToggle={addUserToggle} setDialogToggle={setAddUserToggle} />

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

export default ListTaks
