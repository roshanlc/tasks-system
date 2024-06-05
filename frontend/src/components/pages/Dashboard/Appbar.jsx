import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Toolbar, Typography } from "@mui/material"
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useQueryClient } from "@tanstack/react-query"
import { useContext, useState } from "react"
import { LoginContext } from "../../../store/LoginProvider"
import { toast } from "react-toastify"
import useUserDetails from "../../hooks/useUserDetails"

export default function Appbar() {
    const { dispatchLoginState } = useContext(LoginContext)
    // Dialog state for logout
    const [logoutDialog, setLogoutDialog] = useState(false)

    // queryClient
    const queryClient = useQueryClient()

    const handleLogout = async () => {
        // invalidate all caches in react-query before logout
        queryClient.invalidateQueries()

        dispatchLoginState({ type: "LOGOUT" })
        toast.warn("You have been logged out!")
    }

    // fetch user details
    const { data: userData, isLoading } = useUserDetails()

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Welcome, {isLoading && "...."}{!isLoading && userData !== null && userData?.name || ""}
                    </Typography>
                    <Button color="inherit" variant="outlined" startIcon={<ExitToAppIcon />} onClick={() => {
                        setLogoutDialog(true)
                    }}>Logout</Button>
                </Toolbar>
            </AppBar>

            {/* Logout dialog */}
            <Dialog
                open={logoutDialog}
                onClose={() => {
                    setLogoutDialog(false)
                }}
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle>Confirm Logout?</DialogTitle>
                <Divider />
                <DialogContent>Are you sure you want to logout?</DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleLogout} color="primary" variant="outlined">
                        Confirm
                    </Button>
                    <Button
                        onClick={() => {
                            setLogoutDialog(false)
                        }}
                        color="secondary"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}