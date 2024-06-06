import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import {
    Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Divider, Box, TextField, Pagination,
} from "@mui/material"

import AddCircleIcon from "@mui/icons-material/AddCircle"
import { useContext } from "react"
import { LoginContext } from "../../../../store/LoginProvider"
import Appbar from "../Appbar"
import Task from "./Task"
import AddTask from "./AddTask"
import useTasks from "../../../hooks/useTasks"
import EditTask from "./EditTask"
import SearchIcon from '@mui/icons-material/Search'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import DeleteTask from "./DeleteTask"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const ListTaks = () => {
    const { loginState } = useContext(LoginContext)
    const token = loginState.token

    const [editDialogOpen, setEditDialogOpen] = useState(false)

    // current task for edit or delete action
    const [selectedTask, setSelectedTask] = useState(null)

    // for pagination
    const [currentPage, setCurrentPage] = useState(1) // current page in pagination
    const [totalPages, setTotalPages] = useState(1)

    // state to hold search state
    const [isSearching, setIsSearching] = useState(false)
    const [searchText, setSearchText] = useState("")

    const [tasks, setTasks] = useState(null)
    const { isLoading, error, data, refetch } = useTasks(currentPage || 1, searchText?.trim() || "")


    // call for refetch when current page is changed or searchText is changed
    useEffect(() => {
        refetch() // refetch the tasks
    }, [currentPage, isSearching, refetch])

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

    // mark as complete
    const handleMarkCompletion = async () => {
        try {
            await axios
                .put(`${VITE_BACKEND_URL}/tasks/${selectedTask?.id}`, {
                    ...selectedTask, completed: !selectedTask.completed
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    // Handle successful response
                    setDeleteDialogOpen(false)
                    if (response.status === 200) {
                        refetch() // refetch list
                        toast.success("Task updated successfully")
                    } else {
                        toast.error("Error updating Task")
                    }
                })
                .catch(() => {

                    toast.error("Error updating Task")
                })
        } catch (error) {
            toast.error("Error updating Task")
        }
    }

    const handleSearchOrReset = async () => {
        if (isSearching) {
            // now for clearing search 
            setSearchText("")
            setCurrentPage(1) // get the frist page details
            setIsSearching(false)
        } else {
            if (searchText.trim() == "") {
                toast.warn("please provide a text to search")
                return
            }
            setIsSearching(true)
        }
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
                <Stack direction="row" gap={2} mt={2}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddCircleIcon />}
                        onClick={() => {
                            setAddUserToggle(true)
                        }}
                    >
                        Add Task
                    </Button>
                    <TextField fullWidth label="Search" id="search" sx={{ width: "70%" }} value={searchText} onChange={(e) => {
                        setSearchText((e.target.value).trim())

                    }} />
                    <Button startIcon={isSearching ? <ClearAllIcon /> : <SearchIcon />} variant="outlined" onClick={handleSearchOrReset}> {isSearching ? "Clear" : "Search"}  </Button>
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
                                    setSelectedTask(item)
                                    setEditDialogOpen(true)
                                }}
                                deletionAction={() => {
                                    setSelectedTask(item)
                                    setDeleteDialogOpen(true)
                                }}
                                markCompleteAction={() => {
                                    setSelectedTask(item)
                                    handleMarkCompletion()
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

                {/* Edit task dialog */}
                <EditTask dialogToggle={editDialogOpen} setDialogToggle={setEditDialogOpen} task={selectedTask} refetch={refetch} />

                {/* Delete Confirmation Dialog */}
                <DeleteTask dialogToggle={deleteDialogOpen} setDialogToggle={setDeleteDialogOpen} task={selectedTask} refetch={refetch} />

            </Box>
        </Box>
    )
}

export default ListTaks
