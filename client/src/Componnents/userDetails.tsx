import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import "./App.css";
// import { mockPosts } from "../mocData";
import { IUser } from "../interfaces/user";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { IPost } from "../interfaces/post";
import EditIcon from "@mui/icons-material/Edit";
import ChatIcon from "@mui/icons-material/Chat";
import ChatButton from "./ChatButton";

import UserEditMode from "./userEditMode";
import UserViewMode from "./UserViewMode";
import { ImageModal } from "./ImageModal";
import {
  selectLoggedUser,
  updateLoggedUser,
} from "../Redux/slices/loggedUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts } from "../Redux/slices/postsSlice";
import { updateUser } from "../Redux/slices/usersSlice";
import { editUser } from "../services/usersService";
import { useLocation, useNavigate } from "react-router-dom";
import { startChat } from "../Redux/slices/chatSlice";

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
  const navigate = useNavigate();

  function handleClickOnImage(post: IPost) {
    setSelectedPost(post);
    setOpenImage(true);
  }

  useEffect(() => {
    filterUserPost();
  }, [user]);

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

  function onCheck(user: IUser) {
    if (user._id) editUser(user._id, user);
    setUser(user);
    dispatch(updateLoggedUser(user));
    dispatch(updateUser(user));
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
          <UserEditMode user={user} onCancle={onCancle} onCheck={onCheck} />
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
            <ImageListItem
              key={item.image}
              onClick={() => handleClickOnImage(item)}
            >
              <img
                srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.image}?w=248&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
        <ImageModal
          modalState={openImage}
          seletedPost={selectedPost}
          setModaleState={setOpenImage}
        />
      </Box>
    </div>
  );
}

export default UserDetails;
