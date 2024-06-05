import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    TextField, Typography
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useFormik } from "formik"
import axios from "axios"
import { toast } from "react-toastify"
import { useContext } from "react"
import { LoginContext } from "../../../../store/LoginProvider"
import * as yup from "yup"
import { useQueryClient } from "@tanstack/react-query"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

export default function AddTask({ dialogToggle, setDialogToggle }) {
    const { loginState } = useContext(LoginContext)
    const token = loginState.token
    // queryClient
    const queryClient = useQueryClient()

    // add task formik object
    const addTaskFormik = useFormik({
        initialValues: {
            title: "",
            description: "",
        },
        onSubmit: async (values) => {
            try {
                await axios
                    .post(
                        `${VITE_BACKEND_URL}/tasks`,
                        { ...values },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    )
                    .then((response) => {
                        if (response.status === 201) {
                            addTaskFormik.resetForm()
                            toast.success(`Task was added successfully.`)

                            // invalidate the all tasks list query to fetch new list
                            queryClient.invalidateQueries({ queryKey: ['tasks'] })

                            // close the dialog as well
                            setDialogToggle(false)
                        }
                    })
                    .catch((err) => {
                        console.log(err) // for logging
                        if (err.response.status === 400 || err.response.status === 404) {
                            toast.warn("Please check values and try again.")
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
            title: yup.string().required("Title is required").trim(),
            description: yup.string().required("Description").trim(),
        }),
    })
    return (
        <>
            <Dialog
                open={dialogToggle}
                onClose={() => setDialogToggle(false)}
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle>Add a new task</DialogTitle>
                <Divider />
                <DialogContent>
                    <form onSubmit={addTaskFormik.handleSubmit}>
                        <Box width="100%">
                            < TextField
                                id="title"
                                name="title"
                                label="Title *"
                                type="text"
                                variant="outlined"
                                {...addTaskFormik.getFieldProps("title")}
                                error={addTaskFormik.touched.title && addTaskFormik.errors.title}
                                helperText={
                                    addTaskFormik.touched.title && addTaskFormik.errors.title
                                }
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                id="description"
                                name="description"
                                label="Description *"
                                type="text"
                                variant="outlined"
                                {...addTaskFormik.getFieldProps("description")}
                                error={addTaskFormik.touched.description && addTaskFormik.errors.description}
                                helperText={
                                    addTaskFormik.touched.description && addTaskFormik.errors.description
                                }
                                fullWidth
                                margin="normal"
                            />
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
                        onClick={() => setDialogToggle(false)}
                        startIcon={<CloseIcon />}
                        variant="outlined"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
