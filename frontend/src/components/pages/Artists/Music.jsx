import { useContext } from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
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
import { LoginContext } from "../../../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file


export default function ListMusic() {
    const { id } = useParams()
    const { navigate } = useNavigate()
    // check for valid id
    useEffect(() => {
        if (id < 1) {
            navigate("/artists")
        }
    }, [])

    const { loginState } = useContext(LoginContext)
    const { token } = loginState

    const [userID, setUserID] = useState(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    //  selected user for displaying role while editing roles
    const [selectedUser] = useState(null)
    const [music, setMusic] = useState(null)

    const [oldTitle, setOldTitle] = useState("") // old title is required while updating music record
    // state for editing artist detail
    const [editMusic, setEditMusic] = useState({
        artist_id: parseInt(id) || 0,
        title: "",
        album_name: "",
        genre: "",
    })

    // add music record formik object
    const addMusicFormik = useFormik({
        initialValues: {
            artist_id: 0,
            title: "",
            album_name: "",
            genre: "",

        },
        onSubmit: async (values) => {
            try {
                values.artist_id = parseInt(id) || 0
                await axios
                    .post(
                        `${VITE_BACKEND_URL}/artists/${id}/musics`,
                        { ...values },
                        {
                            headers: { Authorization: `Bearer ${loginState.token}` },
                        }
                    )
                    .then((response) => {
                        if (response.status === 201) {
                            addMusicFormik.resetForm()
                            toast.success(`Music record was added successfully.`)
                            fetchMusicList()
                        }
                    })
                    .catch((err) => {
                        console.log(err) // for logging
                        if (err.response.status === 400 || err.response.status === 404) {
                            toast.warn("Please check values and try again.")
                        } else if (err.response.status === 409) {
                            toast.warn("Music record already exists.")
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
            title: yup.string().required("Title is required"),
            album_name: yup.string().required("Album name is required"),
            genre: yup.string().required("Genre is required"),
        }),
    })

    // for delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    // fetch list of artists
    const fetchMusicList = async () => {
        axios
            .get(`${VITE_BACKEND_URL}/artists/${id}/musics`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                // add index to the data
                const arr = response.data.data.map((item, index) => ({ id: index, ...item }))
                setMusic(arr)
            })
            .catch((error) => {
                
            })
    }

    // effect to auto run fetching of music
    useEffect(() => {
        fetchMusicList()
    }, [])

    // edit user data
    const handleEditMusic = (userId) => {
    // Find the user by ID from the filtered music list
        const record = music.find((user) => user.id === userId)
        if (record) {
            setEditMusic({
                artist_id: parseInt(record.artist_id) || parseInt(id) || 0,
                title: record.title || "",
                album_name: record.album_name || "",
                genre: record.genre || "",
            })
            setUserID(parseInt(id) || record.artist_id)
            setOldTitle(record.title)
            setEditDialogOpen(true)
        }
    }

    // update user details
    const handleUpdateMusic = () => {
    // make some changes to payload
        let payload = editMusic

        axios
            .put(`${VITE_BACKEND_URL}/artists/${userID}/musics?title=${oldTitle || ""}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                // Handle successful response
                console.log("Music record updated:", response.data)
                setEditDialogOpen(false)
                if (response.status === 200) {
                    toast.success("Music record updated successfully")
                    fetchMusicList()
                } else {
                    toast.error("Error updating music record")
                }
            })
            .catch((error) => {
                
                toast.error("Error updating music record")
            })
    }

    const getRowsWithSerialNumber = (rows) => {
        return rows.map((row, index) => ({
            ...row,
            sn: index + 1,
        }))
    }

    const handleDeleteMusic = (userId) => {
    // Find the user by ID from the filtered music list
        const user = music.find((user) => user.id === userId)
        if (user) {
            setEditMusic({
                address: user.address || "",
                contactNo: user.contactNo || "",
                email: user.email || "",
                name: user.name || "",
            })
        }
        setOldTitle(user.title)
        // Set the user ID to be deleted
        setUserID(user.artist_id || parseInt(id) || 0)
        // Open the delete confirmation dialog
        setDeleteDialogOpen(true)
    }

    // delete a user
    const handleConfirmDelete = async () => {
        try {
            await axios
                .delete(`${VITE_BACKEND_URL}/artists/${userID}/musics?title=${oldTitle}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    // Handle successful response
                    console.log("Music record deleted:", response.data)
                    setDeleteDialogOpen(false)
                    if (response.status === 200) {
                        toast.success("Music record deleted successfully")
                        fetchMusicList()
                    } else {
                        toast.error("Error deleting music record")
                    }
                })
                .catch((error) => {
                    
                    toast.error("Error deleting music record")
                })
        } catch (error) {
            
            toast.error("Error deleting music record")
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
        { field: "title", headerName: "Title", width: 200 },
        { field: "album_name", headerName: "Album", width: 180 },
        { field: "genre", headerName: "Genre", width: 80 },
        {
            field: "action",
            headerName: "Action",
            width: 380,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        style={{
                            marginRight: "8px",
                        }}
                        startIcon={<EditIcon />}
                        onClick={() => handleEditMusic(params.row.id)}
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
                        onClick={() => handleDeleteMusic(params.row.id)}
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
          Add Music Record
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => {
                        toast.warn("Bulk import feature is not available yet.")
                    }}
                    sx={{
                        alignSelf: "center",
                        padding: 1,
                        margin: 1,
                    }}
                >
          Bulk Import
                </Button>
            </Stack>
            <Box>

                {music == null || (music?.length === 0) ? (
                    <Typography>No music records were found for the user </Typography>
                ) : (
                    <Box style={{ width: "100%" }}>
                        <DataGrid
                            rows={getRowsWithSerialNumber(music)}
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

            {/* Add music record dialog */}
            <Dialog
                open={addUserToggle}
                onClose={() => setAddUserToggle(false)}
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle>Add new music record</DialogTitle>
                <Divider />
                <DialogContent>
                    <form onSubmit={addMusicFormik.handleSubmit}>
                        <Box width="100%">
                            < TextField
                                id="title"
                                name="title"
                                label="Title *"
                                type="text"
                                variant="outlined"
                                {...addMusicFormik.getFieldProps("title")}
                                error={addMusicFormik.touched.title && addMusicFormik.errors.title}
                                helperText={
                                    addMusicFormik.touched.title && addMusicFormik.errors.title
                                }
                                fullWidth
                                margin="normal"
                            />
                            < TextField
                                id="album_name"
                                name="album_name"
                                label="Album Name *"
                                type="text"
                                variant="outlined"
                                {...addMusicFormik.getFieldProps("album_name")}
                                error={addMusicFormik.touched.album_name && addMusicFormik.errors.album_name}
                                helperText={
                                    addMusicFormik.touched.album_name && addMusicFormik.errors.album_name
                                }
                                fullWidth
                                margin="normal"
                            />
                            <InputLabel id="genre-label">Genre</InputLabel>
                            < Select
                                labelId="genre-label"
                                label="Genre"
                                id="role"
                                variant="outlined"
                                {...addMusicFormik.getFieldProps("genre")}
                                error={addMusicFormik.touched.genre && addMusicFormik.errors.genre}
                                helperText={
                                    addMusicFormik.touched.genre && addMusicFormik.errors.genre
                                }
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value={"rnb"}>Rythm and Blues</MenuItem>
                                <MenuItem value={"classic"}>Classic</MenuItem>
                                <MenuItem value={"rock"}>Rock</MenuItem>
                                <MenuItem value={"jazz"}>Jazz</MenuItem>
                                <MenuItem value={"country"}>Country</MenuItem>

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
                <DialogTitle>Edit Music Record Details</DialogTitle>
                <Divider />
                <DialogContent>
                    <TextField
                        label="Title"
                        value={editMusic.title}
                        onChange={(e) => setEditMusic({ ...editMusic, name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Album Name"
                        value={editMusic.album_name}
                        onChange={(e) =>
                            setEditMusic({ ...editMusic, address: e.target.value })
                        }
                        fullWidth
                        margin="normal"
                    />
                    <InputLabel id="genre-label">Genre</InputLabel>
                    < Select
                        labelId="genre-label"
                        label="Genre"
                        id="role"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={editMusic.genre}
                        onChange={(e) =>
                            setEditMusic({ ...editMusic, genre: e.target.value })
                        }
                    >
                        <MenuItem value={"rnb"}>Rythm and Blues</MenuItem>
                        <MenuItem value={"classic"}>Classic</MenuItem>
                        <MenuItem value={"rock"}>Rock</MenuItem>
                        <MenuItem value={"jazz"}>Jazz</MenuItem>
                        <MenuItem value={"country"}>Country</MenuItem>

                    </Select>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button
                        onClick={handleUpdateMusic}
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
            </Dialog>record

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
            Are you sure you want to delete this music record?
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
