import {
  Avatar,
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
} from "@mui/material";
import "./App.css";
import { mockPosts, mockUsers } from "../mocData";
import { useEffect, useState } from "react";
import { IPost } from "../interfaces/post";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RecipeReviewCard from "./imageCard";
import { ImageModal } from "./ImageModal";

function Home() {
  const [shuffledItem, setShuffeldItem] = useState<IPost[]>(mockPosts);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<IPost>(mockPosts[0]);

  function handleClickOnImage(post: IPost) {
    setSelectedPost(post);
    setOpenImage(true);
  }

  useEffect(() => {
    setShuffeldItem(shuffleArray(shuffledItem));
  }, []);

  function shuffleArray(array: IPost[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }
  return (
    <div>
      <ImageList variant="masonry" cols={3} gap={8}>
        {shuffledItem.map((item) => (
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
                      alt={mockUsers
                        .find((user) => user.username === item.owner)
                        ?.username.toUpperCase()}
                      src={
                        mockUsers.find((user) => user.username === item.owner)
                          ?.profilePicture
                      }
                      sx={{ width: 35, height: 35, marginLeft: 2 }}
                    />
                    {item.title}
                  </Box>
                </div>
              }
              position="top"
              actionIcon={
                <IconButton
                  sx={{ color: "white" }}
                  aria-label={`star ${item.title}`}
                >
                  <FavoriteBorderIcon />
                </IconButton>
              }
              actionPosition="left"
            />
          </ImageListItem>
        ))}
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
