import React, { useContext, useEffect, useRef, useState } from "react";
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
import UserContext from "../UserContext";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from "./formatDate";
import { Link } from "react-router-dom";

export default function CommentsBottomNavigation({ postId, comments }) {
    const { currUser } = useContext(UserContext);
    const [value, setValue] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentList, setCommentList] = useState(comments || []);
    const ref = useRef(null);

    console.debug("inside commentsbottomnav", commentList);

    useEffect(() => {
        ref.current.ownerDocument.body.scrollTop = 0;
    }, [value]);

    const handleAddComment = async () => {
        if (newComment.trim() !== "") {
            try {
                const data = await TransconnectApi.createComment(postId, newComment, currUser.id);
                console.debug("New comment created", data);

                setCommentList([...commentList, data]);
                setNewComment("");
                setShowInput(false);
            } catch (err) {
                console.error("Error saving comment", err);
            }
        }
    };


    const handleDeleteComment = async (commentId) => {
        try {
            let comment = await TransconnectApi.getComment(postId, commentId);
            await TransconnectApi.deleteComment(postId, commentId, comment);
            setCommentList(commentList.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error("Error deleting comment", err);
        }
    };

    return (
        <Box sx={{ pb: 7 }} ref={ref}>
            <CssBaseline />
            {commentList.length > 0 ? (
                <List>
                    {commentList.map(({ id, content, createdAt, author }) => (
                        <ListItemButton key={id}>
                            <ListItemText
                                primary={content}
                                secondary={
                                    <>
                                        {formatDate(createdAt)} -{" "}
                                        <Link to={`/profile/${author?.username}`} style={{ textDecoration: 'none', color: 'black' }}>
                                            {author?.username ? `@${author.username}` : "Unknown"}
                                        </Link>
                                    </>
                                }
                            />
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(id)}>
                                <DeleteIcon />
                            </IconButton>
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