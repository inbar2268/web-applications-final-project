import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { createComment, getComments, deleteComment } from '../services/commentsService';
import { IComment } from '../interfaces/comment';
import { useDispatch, useSelector } from "react-redux";
import { selectUsers } from "../Redux/slices/usersSlice";
import { IPost } from '../interfaces/post';
import {
  selectLoggedUser,
} from "../Redux/slices/loggedUserSlice";
import { updatePost } from '../Redux/slices/postsSlice';

interface CommentsProps {
  post: IPost;
}

const CommentPopup: React.FC<CommentsProps> = ({ post }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loggedUser = useSelector(selectLoggedUser);
  const users = useSelector(selectUsers);

  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, post._id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getComments(post._id);
      setComments(Array.isArray(response) ? response : []);
    } catch (err) {
        if (err.response.status === 404) {
          setComments([]);
        } else {
          console.error("Error fetching comments:", err);
          setError("Failed to load comments. Please try again.");
        }
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    setLoading(true);
    setError("");
    
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
      dispatch(updatePost({ ...post, commentsCount: post.commentsCount - 1 }));
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    
    setLoading(true);
    setError("");
    
    const commentData: IComment = {
      comment: newComment,
      userId: loggedUser?._id || "", 
      postId: post._id,
    };

    
    try {
      const response = await createComment(commentData);
      setComments([...comments, response]);
      dispatch(updatePost({ ...post, commentsCount: post.commentsCount + 1 }));

    } catch (err) {
      console.error("Error adding comment:", err);
      setError(String(err));
    } finally {
      setNewComment("");
      setLoading(false);
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const getUsernameById = (userId: string): string => {
    const userFound = users.find(user => user._id === userId);
    return userFound ? userFound.username : "Unknown User";
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <>
      <IconButton
        sx={{ color: "white" }}
        aria-label="comments"
        onClick={handleOpen}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <CommentIcon sx={{ color: 'white' }} />
      </IconButton>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="comment-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography id="comment-modal-title" variant="h6" component="h2">
              Comments ({comments.length})
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider />
          
          {error && (
            <Typography color="error" sx={{ my: 2 }}>
              {error}
            </Typography>
          )}
          
          <List sx={{ overflow: 'auto', flexGrow: 1, maxHeight: '50vh' }}>
            {loading && comments.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <React.Fragment key={comment._id}>
                  <ListItem 
                    alignItems="flex-start"
                    secondaryAction={
                      comment.userId === loggedUser?._id ? ( 
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          sx={{ fontSize: 18 }} 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComment(comment._id || "");
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      ) : null
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {getUsernameById(comment.userId)}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{
                              wordWrap: 'break-word',  
                              whiteSpace: 'normal', 
                            }}
                          >
                            {comment.comment}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </React.Fragment>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', my: 2, color: 'text.secondary' }}>
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </List>
          
          <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
              onClick={(e) => e.stopPropagation()}
              disabled={loading}
            />
            <Button 
              sx={{ backgroundColor: "#E8B08E", color: "white" }}
              variant="contained" 
              endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleAddComment();
              }}
              disabled={loading || newComment.trim() === ""}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CommentPopup;