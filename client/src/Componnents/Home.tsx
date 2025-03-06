import {
  Avatar,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import "./App.css";
import { useEffect, useState } from "react";
import { IPost } from "../interfaces/post";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { ImageModal } from "./ImageModal";
import CommentPopup from "./Comments";
import { getposts } from "../services/postsService";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, updatePostsArray } from "../Redux/slices/postsSlice";
import { getUsers } from "../services/usersService";
import { selectUsers, updateUsersArray } from "../Redux/slices/usersSlice";

function Home() {
  const posts = useSelector(selectPosts);
  const users = useSelector(selectUsers);

  const [shuffledItem, setShuffeldItem] = useState<IPost[]>(posts);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<IPost>(posts[0]);
  const dispatch = useDispatch();

  function handleClickOnImage(post: IPost) {
    setSelectedPost(post);
    setOpenImage(true);
  }

  useEffect(() => {
    setShuffeldItem(shuffleArray(posts));
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

  function shuffleArray(array: IPost[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }
  return (
    <div>
      <ImageList variant="masonry" cols={3} gap={8}>
        {shuffledItem.map((item) => {
          const user = users.find((user) => user.username === item.owner);
          return (
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
              <ImageListItemBar
                sx={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                    "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                title={
                  <div dir="rtl">
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <Avatar
                        alt={user?.username.toUpperCase()}
                        src={user?.profilePicture}
                        sx={{ width: 35, height: 35, marginLeft: 2 }}
                      />
                      {item.title}
                    </Box>
                  </div>
                }
                position="top"
                actionIcon={
                  <Box sx={{ display: "flex" }}>
                    <IconButton
                      sx={{ color: "white" }}
                      aria-label={`star ${item.title}`}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                    <CommentPopup postId={item._id} />
                  </Box>
                }
                actionPosition="left"
              />
            </ImageListItem>
          );
        })}
      </ImageList>

      <ImageModal
        modalState={openImage}
        seletedPost={selectedPost}
        setModaleState={setOpenImage}
      />
    </div>
  );
}

export default Home;
