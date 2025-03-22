import {
  ImageList,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  Fab
} from "@mui/material";
import "./App.css";
import { useEffect, useState } from "react";
import { IPost } from "../interfaces/post";
import { ImageModal } from "./ImageModal";
import { getposts, deletePost } from "../services/postsService";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, updatePostsArray } from "../Redux/slices/postsSlice";
import { getUsers } from "../services/usersService";
import { selectUsers, updateUsersArray } from "../Redux/slices/usersSlice";
import { selectLoggedUser } from "../Redux/slices/loggedUserSlice";
import { AddPostPage } from "./AddPost";
import AddIcon from "@mui/icons-material/Add";
import PostListItem from "./PostListItem";

function Home() {
  const posts = useSelector(selectPosts);
  const users = useSelector(selectUsers);
  const currentUser = useSelector(selectLoggedUser);
  const [reverseItems, setReverseItems] = useState<IPost[]>(posts);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<IPost>(posts[0]);
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [openAddPostModal, setOpenAddPostModal] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  function handleClickOnImage(post: IPost) {
    setSelectedPost(post);
    setOpenImage(true);
  }

  const handleDeleteClick = (event: React.MouseEvent, postId: string) => {
    event.stopPropagation();
    setPostToDelete(postId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPostToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      await deletePost(postToDelete);
      
      const updatedPosts = posts.filter(post => post._id !== postToDelete);
      dispatch(updatePostsArray(updatedPosts));
      
      setNotification({
        open: true,
        message: "Post deleted successfully!",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      setNotification({
        open: true,
        message: "Failed to delete post. Please try again.",
        severity: "error"
      });
    } finally {
      setOpenDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  useEffect(() => {
    setReverseItems([...posts].reverse());
  }, [posts]);

  useEffect(() => {
    getposts().then((response) => {
      console.log(response);
      dispatch(updatePostsArray(response));
    });
    getUsers().then((response) => {
      dispatch(updateUsersArray(response));
    });
  }, []);

  function isUserLoggedIn(): boolean {
    return !(currentUser.username === "" && currentUser.email === "" && currentUser.password === "");
  }

  const handleAddPostClick = () => {
    setOpenAddPostModal(true); 
  };

  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };
  
  const handlePostSubmissionResult = (success: boolean) => {
    setOpenAddPostModal(false); 
    setNotification({
      open: true,
      message: success ? "Post created successfully!" : "Failed to create post. Please try again.",
      severity: success ? "success" : "error"
    });
  };

  const getColumnCount = () => {
    if (reverseItems.length <= 1) return 1;
    if (reverseItems.length <= 3) return 2;
    return 3;
  };

  return (
    <div>
      <ImageList 
        variant="masonry" 
        cols={getColumnCount()} 
        gap={8}
      >
        {reverseItems.map((item) => {
          const user = users.find((user) => user._id === item.userId);
          
          return (
            <PostListItem
              key={item._id}
              post={item}
              user={user}
              onImageClick={handleClickOnImage}
              onDeleteClick={handleDeleteClick}
            />
          );
        })}
      </ImageList>

      <ImageModal
        modalState={openImage}
        seletedPost={selectedPost}
        setModaleState={setOpenImage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this post?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ 
            width: '100%',
            backgroundColor: notification.severity === 'success' ? '#EDF7ED' : '#FDEDED',
            color: notification.severity === 'success' ? '#1E4620' : '#5F2120',
            '& .MuiAlert-icon': {
              color: notification.severity === 'success' ? '#4CAF50' : '#EF5350'
            }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      {isUserLoggedIn() && (
        <Fab 
          color="primary" 
          aria-label="add post"
          onClick={handleAddPostClick}
          sx={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            backgroundColor: '#E8B08E',
            '&:hover': {
              backgroundColor: '#B05219',
            },
            '&:active': {
              backgroundColor: '#B05219',
              transform: 'none', 
            },
            boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
          }}
        >
          <AddIcon />
        </Fab>
      )}
      
      {openAddPostModal && (
        <AddPostPage
          handleClose={() => setOpenAddPostModal(false)}
          onSubmitResult={handlePostSubmissionResult}
        />
      )}
    </div>
  );
}

export default Home;