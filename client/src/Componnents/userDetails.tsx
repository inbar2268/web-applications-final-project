import { Box, IconButton, ImageList } from "@mui/material";
import "./App.css";
import { IUser } from "../interfaces/user";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { IPost } from "../interfaces/post";
import EditIcon from "@mui/icons-material/Edit";
import ChatButton from "./ChatButton";
import UserEditMode from "./userEditMode";
import UserViewMode from "./UserViewMode";
import { ImageModal } from "./ImageModal";
import { selectLoggedUser } from "../Redux/slices/loggedUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, updatePostsArray } from "../Redux/slices/postsSlice";
import { useLocation } from "react-router-dom";
import PostListItem from "./PostListItem";
import { deletePost } from "../services/postsService";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

function UserDetails() {
  const location = useLocation();
  const loggedUser = useSelector(selectLoggedUser);
  const [user, setUser] = useState<IUser>(location.state?.user);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const allPosts = useSelector(selectPosts);
  const [selectedPost, setSelectedPost] = useState<IPost>(allPosts[0]);
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
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

      // Update local posts state
      const updatedPosts = posts.filter((post) => post._id !== postToDelete);
      setPosts(updatedPosts);

      // Update global posts state
      const updatedAllPosts = allPosts.filter(
        (post) => post._id !== postToDelete
      );
      dispatch(updatePostsArray(updatedAllPosts));

      setNotification({
        open: true,
        message: "Post deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      setNotification({
        open: true,
        message: "Failed to delete post. Please try again.",
        severity: "error",
      });
    } finally {
      setOpenDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    filterUserPost();
  }, [user, allPosts]);

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
    }
  }, [location.state]);

  function filterUserPost() {
    setPosts(allPosts.filter((post) => post.userId === user._id));
  }

  function onCancle() {
    setEditMode(false);
  }

  function confirmUpdateUser(user: IUser) {
    setUser(user);
    setEditMode(false);
  }

  return (
    <div>
      <Box
        sx={{
          position: "relative",
          left: 0,
          width: "40rem",
          height: "10rem",
          border: "5px double  #E8B08E",
        }}
      >
        {!editMode ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                position: "absolute",
                right: "8px",
                bottom: "8px",
              }}
            >
              {user._id !== loggedUser?._id && loggedUser?.username !== "" && (
                <ChatButton userId={user._id} />
              )}
              {user._id === loggedUser?._id && (
                <IconButton
                  aria-label="edit"
                  onClick={() => setEditMode(!editMode)}
                  sx={{
                    color: "#B05219",
                    width: "1.8rem",
                    height: "1.8rem",
                    "&:focus": { outline: "none" },
                    "&:focus-visible": { outline: "none" },
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
            <UserViewMode user={user} />
          </>
        ) : (
          <UserEditMode
            user={user}
            onCancle={onCancle}
            onCheck={confirmUpdateUser}
          />
        )}
      </Box>
      <Divider
        sx={{
          position: "relative",
          backgroundColor: "#B05219",
          top: "1rem",
          my: 2,
        }}
      />
      <Box
        sx={{
          position: "relative",
          p: 2,
        }}
      >
        <ImageList variant="masonry" cols={3} gap={8}>
          {posts.map((item) => (
            <PostListItem
              key={item._id}
              post={item}
              user={user}
              onImageClick={handleClickOnImage}
              onDeleteClick={handleDeleteClick}
            />
          ))}
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
              Are you sure you want to delete this post? This action cannot be
              undone.
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
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{
              width: "100%",
              backgroundColor:
                notification.severity === "success" ? "#EDF7ED" : "#FDEDED",
              color:
                notification.severity === "success" ? "#1E4620" : "#5F2120",
              "& .MuiAlert-icon": {
                color:
                  notification.severity === "success" ? "#4CAF50" : "#EF5350",
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}

export default UserDetails;
