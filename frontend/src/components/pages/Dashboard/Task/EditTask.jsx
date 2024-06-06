import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { LoginContext } from "../../../../store/LoginProvider"
import { toast } from "react-toastify"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

export default function EditTask({ task, dialogToggle, setDialogToggle, refetch }) {
    const { loginState } = useContext(LoginContext)
    const token = loginState.token

    // edit user data
    const [editTask, setEditTask] = useState({
        title: "",
        description: "",
    })

    useEffect(() => {
        setEditTask({
            title: task?.title || "",
            description: task?.description || "",
        })
    }, [task])

    // update task details
    const handleUpdateTask = () => {
        axios
            .put(`${VITE_BACKEND_URL}/tasks/${task?.id}`, editTask, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                // Handle successful response
                console.log("Task updated:", response.data)
                setDialogToggle(false)
                if (response.status === 200) {
                    toast.success("Task updated successfully")
                    refetch() // refetch after completion
                } else {
                    toast.error("Error updating task")
                }
            })
            .catch(() => {
                toast.error("Error updating task")
            })
    }

    return (
        < Dialog
            open={dialogToggle}
            onClose={() => setDialogToggle(false)
            }
            fullWidth
        >
            <DialogTitle>Edit Task Details</DialogTitle>
            <Divider />
            <DialogContent>
                <TextField
                    label="Title"
                    value={editTask.title}
                    onChange={(e) =>
                        setEditTask({ ...editTask, title: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={editTask.description}
                    onChange={(e) =>
                        setEditTask({ ...editTask, description: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button
                    onClick={handleUpdateTask}
                    color="primary"
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    Update
                </Button>
                <Button
                    onClick={() => setDialogToggle(false)}
                    startIcon={<CloseIcon />}
                    variant="outlined"
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog >
    )
}