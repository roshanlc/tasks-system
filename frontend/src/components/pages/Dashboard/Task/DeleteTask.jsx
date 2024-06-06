import { useContext } from "react"
import { LoginContext } from "../../../../store/LoginProvider"
import { toast } from "react-toastify"
import axios from "axios"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

export default function DeleteTask({ task, dialogToggle, setDialogToggle, refetch }) {
    const { loginState } = useContext(LoginContext)
    const token = loginState.token

    // delete a task
    const handleConfirmDelete = async () => {
        try {
            await axios
                .delete(`${VITE_BACKEND_URL}/tasks/${task?.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    // Handle successful response
                    setDialogToggle(false)
                    if (response.status === 200) {
                        refetch() // refetch list
                        toast.success("Task deleted successfully")
                    } else {
                        toast.error("Error deleting Task")
                    }
                })
                .catch(() => {

                    toast.error("Error deleting Task")
                })
        } catch (error) {

            toast.error("Error deleting Task")
        }
    }

    const handleCancelDelete = () => {
        // Close the delete confirmation dialog
        setDialogToggle(false)
    }

    return (
        <Dialog
            open={dialogToggle}
            onClose={setDialogToggle}
            maxWidth={"md"}
            fullWidth
        >
            <DialogTitle>Delete Task</DialogTitle>
            <Divider />
            <DialogContent>
                <Typography variant="h5" sx={{ m: 1 }}>
                    Are you sure you want to delete this task?
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
    )
}