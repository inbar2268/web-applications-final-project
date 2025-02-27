import {
  Avatar,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import "./App.css";
import { mockPosts } from "../mocData";
import { useEffect, useState } from "react";
import { Post } from "../interfaces/post";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Home() {
  const [shuffledItem, setShuffeldItem] = useState<Post[]>(mockPosts);

  useEffect(() => {
    setShuffeldItem(shuffleArray(shuffledItem));
  }, []);

  function shuffleArray(array: Post[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }
  return (
    <div>
      <ImageList variant="masonry" cols={3} gap={8}>
        {shuffledItem.map((item) => (
          <ImageListItem key={item.image}>
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
                      alt="User"
                      src="/static/images/avatar/2.jpg"
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
    </div>
  );
}

export default Home;
