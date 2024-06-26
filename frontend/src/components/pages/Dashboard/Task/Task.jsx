import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import { Chip, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import toTimeAgo from "../../../../utils/utils"

export default function Task({ task, editAction, markCompleteAction, deletionAction }) {
    return (
        <Card variant="outlined">
            <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography gutterBottom variant="h5" component="div">
                        {task?.title || "Title"}
                        {task?.completed && <Chip label="completed" color="success" variant="outlined" sx={{ margin: 1, padding: -5 }} />}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {task?.created_at && toTimeAgo(task.created_at) == 0 ? "today" : toTimeAgo(task.created_at) + " days ago" || ""}
                    </Typography>
                </Stack>
                <Typography color="text.primary" variant="body1">
                    {task?.description}
                </Typography>
            </Box>
            <Divider />
            <Stack direction="row" sx={{ float: 'right', marginRight: 3 }}>
                <IconButton id="edit" aria-label="edit" disabled={task?.completed || false}
                    onClick={editAction}>
                    <EditIcon color="primary" />
                </IconButton>
                <IconButton id="mark-complete" aria-label="mark-complete" onClick={markCompleteAction}>
                    <DoneAllIcon color="success" />
                </IconButton>
                <IconButton id="delete" aria-label="delete"
                    onClick={deletionAction}
                >
                    <DeleteIcon color="error" />
                </IconButton>
            </Stack>
        </Card>
    )
}