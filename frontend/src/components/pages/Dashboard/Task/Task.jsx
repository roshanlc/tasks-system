import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DoneAllIcon from '@mui/icons-material/DoneAll'

export default function Task({ title, description, isCompleted, editAction, markCompleteAction, deletionAction }) {
    return (
        <Card variant="outlined" sx={{ maxWidth: 360 }}>
            <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography gutterBottom variant="h5" component="div">
                        {title || "Title"}
                    </Typography>

                </Stack>
                <Typography color="text.primary" variant="body1">
                    {description || "Details"}
                </Typography>
            </Box>
            <Divider />
            <Stack direction="row" sx={{ float: 'right', marginRight: 3 }}>
                <IconButton aria-label="edit">
                    <EditIcon color="primary" />
                </IconButton>
                <IconButton aria-label="mark-complete">
                    <DoneAllIcon color="success" />
                </IconButton>
                <IconButton aria-label="next">
                    <DeleteIcon color="error" />
                </IconButton>
            </Stack>
        </Card>
    )
}