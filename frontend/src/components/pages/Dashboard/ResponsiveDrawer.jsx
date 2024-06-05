// drawer.jsx
import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuIcon from "@mui/icons-material/Menu"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import { useContext } from "react"
import SettingsIcon from "@mui/icons-material/Settings"
import { useState } from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material"

import { toast } from "react-toastify"
import { Divider } from "@mui/material"
import { useQueryClient } from "@tanstack/react-query"
import AccountBoxIcon from "@mui/icons-material/AccountBox"
import { useLocation } from "react-router-dom"
import { LoginContext } from "../../../store/LoginProvider"

const drawerWidth = 240

function ResponsiveDrawer(props) {
    const { loginState, dispatchLoginState } = useContext(LoginContext)
    const { window } = props
    const [mobileOpen, setMobileOpen] = React.useState(false)

    // Dialog state for logout
    const [logoutDialog, setLogoutDialog] = useState(false)


    // queryClient
    const queryClient = useQueryClient()

    const [name, setName] = useState("")

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleLogout = async () => {
    // invalidate all caches in react-query before logout
        queryClient.invalidateQueries()

        dispatchLoginState({ type: "LOGOUT" })
        toast.warn("You have been logged out!")
    }



    // what does this do ?? need comment here!
    const container =
    window !== undefined ? () => window().document.body : undefined

    const location = useLocation() // location

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
            Artist Dashboard
                    </Typography>

                    <Box
                        sx={{
                            marginLeft: "auto",
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: "center",
                            justifyContent: "center",
                            justifyItems: "center",
                            alignContent: "center",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            <Typography>
                                {name === "" ? "Role" : <b>{name}</b>} :
                                {loginState.role}
                            </Typography>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    <ListItem
                        key="Users"
                        disablePadding
                        component={Link}
                        button
                        to={"/dashboard"}
                        selected={location.pathname === "/dashboard" ? true : false}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem
                        key="Artist"
                        disablePadding
                        component={Link}
                        button
                        to={"/artists"}
                        selected={location.pathname === "/artists" ? true : false}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Artists" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem
                        key="Logout"
                        disablePadding
                        component={Link}
                        onClick={() => {
                            setLogoutDialog(true)
                        }}
                        button
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {props.children}
            </Box>


            <Dialog
                open={logoutDialog}
                onClose={() => {
                    setLogoutDialog(false)
                }}
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

ResponsiveDrawer.propTypes = {
    window: PropTypes.func,
}

export default ResponsiveDrawer
