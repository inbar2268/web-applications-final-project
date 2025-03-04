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


interface CommentsProps {
  postId: string;
}

const CommentPopup: React.FC<CommentsProps> = ({ postId }) => {
  // State for managing comments
  const [comments, setComments] = useState<IComment[]>([]);
  // State for managing the modal
  const [open, setOpen] = useState(false);
  // State for new comment text
  const [newComment, setNewComment] = useState("");
  // Loading state
  const [loading, setLoading] = useState(false);
  // Error state
  const [error, setError] = useState("");

  const mockpostId = "67c57bd73ba7e81e7bfa37bc";
  const mockowner = "hadar123"



  useEffect(() => {
    if (open) {

        fetchComments();
    }
  }, [open, postId]);

    const fetchComments = async () => {
    try {
        console.log("open comments")

        setLoading(true);
        setError("");
        const response = await getComments(mockpostId);
        setComments(Array.isArray(response) ? response : []);
    } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments. Please try again.");
    } finally {
        setLoading(false);
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    
    setLoading(true);
    setError("");
    
    try {
      const response = await deleteComment(commentId);
      setComments([...comments, response]);
    } catch (err) {
      console.error("Error deleteing comment:", err);
      setError("Failed to delete comment. Please try again.");
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
      owner: mockowner,
      postId: mockpostId
    };
    
    try {
      const response = await createComment(commentData);
      setComments([...comments, response]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
    } finally {
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
        // Prevent event propagation in multiple ways
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
          
          {/* Show error message if there is one */}
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
                  <ListItem alignItems="flex-start"
                        secondaryAction={
                            comment.owner === mockowner ? (
                              <IconButton edge="end" aria-label="delete" sx={{ fontSize: 18 }} 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteComment(comment._id || "");
                              }}>
                                <DeleteIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            ) : null
                          }
                  >
                    <ListItemText
                      primary={<Typography variant="subtitle2">{comment.owner}</Typography>}
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