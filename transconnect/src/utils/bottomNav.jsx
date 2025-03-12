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
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { formatDate } from "./formatDate";
import { Link } from "react-router-dom";

export default function CommentsBottomNavigation({ postId }) {
    const { currUser } = useContext(UserContext);
    const [value, setValue] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentList, setCommentList] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        ref.current.ownerDocument.body.scrollTop = 0;
    }, [value]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const comments = await TransconnectApi.getComments(postId);
                setCommentList(comments);
            } catch (err) {
                console.error(`Error fetching comments for post #${postId}`, err);
            }
        };

        fetchComments();
    }, [postId]);

    const handleAddComment = async () => {
        if (newComment.trim() !== "") {
            try {
                const data = await TransconnectApi.createComment(postId, newComment, currUser.id);
                setCommentList([...commentList, data]);
                setNewComment("");
                setShowInput(false);
            } catch (err) {
                console.error("Error saving comment", err);
            }
        }
    };

    const handleDeleteComment = async (commentId, authorUsername) => {
        try {
            const comment = await TransconnectApi.getComment(commentId);
            await TransconnectApi.deleteComment(postId, commentId, comment, authorUsername);
            setCommentList(commentList.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error("Error deleting comment", err);
        }
    };

    const handleEditComment = async (commentId) => {
        if (editedCommentText.trim() === "") return;

        try {
            const updatedContent = await TransconnectApi.editComment(postId, commentId, editedCommentText, currUser.username);

            console.debug("updated content in handleEditComment", updatedContent);

            setCommentList(commentList.map(comment =>
                comment.id === commentId ? { ...comment, content: updatedContent.content } : comment
            ));

            setEditingCommentId(null);
            setEditedCommentText("");
        } catch (err) {
            console.error("Error editing comment", err);
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
                                primary={
                                    editingCommentId === id ? (
                                        <TextField
                                            fullWidth
                                            value={editedCommentText}
                                            onChange={(e) => setEditedCommentText(e.target.value)}
                                        />
                                    ) : (
                                        content
                                    )
                                }
                                secondary={
                                    <>
                                        {formatDate(createdAt)} -{" "}
                                        <Link to={`/profile/${author?.username}`} style={{ textDecoration: 'none', color: 'black' }}>
                                            {author?.username === currUser.username ? "You" : `@${author?.username}`}
                                        </Link>
                                    </>
                                }
                            />
                            {(currUser.username === author?.username || currUser.role === 'ADMIN') && (
                                <>
                                    {editingCommentId === id ? (
                                        <IconButton edge="end" aria-label="save" onClick={() => handleEditComment(id)}>
                                            <SaveIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton edge="end" aria-label="edit" onClick={() => {
                                            setEditingCommentId(id);
                                            setEditedCommentText(content);
                                        }}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(id, author.username)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            )}
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
