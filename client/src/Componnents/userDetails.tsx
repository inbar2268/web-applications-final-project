import {
  Avatar,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import "./App.css";
import { mockPosts, mockUsers } from "../mocData";
import { IUser } from "../interfaces/user";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { IPost } from "../interfaces/post";
import EditIcon from "@mui/icons-material/Edit";

function UserDetails() {
  const [user, setUser] = useState<IUser>(mockUsers[3]);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    filterUserPost();
  }, []);

  //TODO: switch to with get posts by owner
  function filterUserPost() {
    setPosts(mockPosts.filter((post) => post.owner === user.username));
  }

  return (
    <div>
      <Box
        sx={{
          position: "relative",
          left: 0,
          //   p: 2,
          width: "40rem",
          height: "10rem",
          border: "5px ridge #E8B08E",
        }}
      >
        <IconButton
          aria-label="edit"
          sx={{
            float: "right",
            color: "#B05219",
            width: "1.8rem",
            height: "1.8rem",
            top: "80%",
          }}
        >
          <EditIcon />
        </IconButton>

        <Avatar
          alt="User"
          src={user?.profilePicture}
          sx={{
            width: "10rem",
            height: "10rem",
            float: "left",
            marginRight: 5,
          }}
        />
        <Box
          sx={{
            color: " #B05219",
            textAlign: "left",
            p: 4,
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontFamily: "monospace", fontWeight: "bold" }}
          >
            {user.username}
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontFamily: "monospace" }}
          >
            {user.email}
          </Typography>
        </Box>
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
            <ImageListItem key={item.image}>
              <img
                srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.image}?w=248&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </div>
  );
}

export default UserDetails;
