import React, { useEffect, useRef, useState } from "react";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AddCommentIcon from '@mui/icons-material/AddComment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TransconnectApi from "../api";

export default function CommentsBottomNavigation({ postId, comments }) {
    const [value, setValue] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentList, setCommentList] = useState(comments || []);
    const ref = useRef(null);

    useEffect(() => {
        ref.current.ownerDocument.body.scrollTop = 0;
    }, [value]);

    const handleAddComment = async () => {
        if (newComment.trim() !== "") {
            setCommentList([...commentList, { primary: newComment, secondary: "Just now", person: "You" }]);
            setNewComment("");
            setShowInput(false);
            try {
                const data = await TransconnectApi.createComment(postId, newComment);
                console.debug(data);
            } catch (err) {
                console.error("Error saving comment", err);
            }
        }
    };

    return (
        <Box sx={{ pb: 7 }} ref={ref}>
            <CssBaseline />
            {commentList.length > 0 ? (
                <List>
                    {commentList.map(({ primary, secondary, person }, index) => (
                        <ListItemButton key={index}>
                            <ListItemText primary={primary} secondary={`${secondary} - ${person}`} />
                        </ListItemButton>
                    ))}
                </List>
            ) : (
                <List>No comments yet!</List>
            )}

            {showInput && (
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                        label="Add a comment..."
                        variant="outlined"
                        fullWidth
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleAddComment}>Submit</Button>
                </Box>
            )}

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction
                        label="Comment"
                        icon={<AddCommentIcon />}
                        onClick={() => setShowInput(!showInput)}
                    />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}