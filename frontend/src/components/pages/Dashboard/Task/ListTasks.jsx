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
import EditTask from "./EditTask"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const ListTaks = () => {
    const { loginState } = useContext(LoginContext)
    const token = loginState.token

    const [userID, setUserID] = useState(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    // current task for edit or delete action
    const [selectedTask, setSelectedTask] = useState(null)
    const [users, setUsers] = useState(null)

    // for pagination
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
                        // fetchUserList()
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
            <Box
                // display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                // width={"80%"}
                marginLeft={"10%"}
                marginRight={"10%"}
            >
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
                            <Task key={id} task={item}
                                editAction={() => {
                                    console.log("pressed edit for ", item.id) // TODO: remove this later
                                    setSelectedTask(item)
                                    setEditDialogOpen(true)
                                }}

                            />
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

                <EditTask dialogToggle={editDialogOpen} setDialogToggle={setEditDialogOpen} task={selectedTask} refetch={refetch} />

                {/* Delete Confirmation Dialog */}
                {/* <Dialog
                    open={deleteDialogOpen}
                    onClose={handleCancelDelete}
                    maxWidth={"md"}
                    fullWidth
                >
                    <DialogTitle>Delete User</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Stack direction="column" gap={1}>
                            {selectedTask !== undefined && selectedTask !== null && (
                                <>
                                    <Typography>Name: {selectedTask.name}</Typography>
                                    <Typography>Email: {selectedTask.email}</Typography>

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
                                                {selectedTask.UserRoles.map((role, index) => (
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
                </Dialog> */}
            </Box>

        </Box>
    )
}

export default ListTaks
