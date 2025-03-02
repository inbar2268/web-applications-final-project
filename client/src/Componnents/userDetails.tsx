import { Box, IconButton, ImageList, ImageListItem } from "@mui/material";
import "./App.css";
import { mockPosts, mockUsers } from "../mocData";
import { IUser } from "../interfaces/user";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { IPost } from "../interfaces/post";
import EditIcon from "@mui/icons-material/Edit";
import UserEditMode from "./userEditMode";
import UserViewMode from "./UserViewMode";

function UserDetails() {
  const [user, setUser] = useState<IUser>(mockUsers[3]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    filterUserPost();
  }, []);

  //TODO: switch to with get posts by owner
  function filterUserPost() {
    setPosts(mockPosts.filter((post) => post.owner === user.username));
  }

  function onCancle() {
    setEditMode(false);
  }
  //TODO: switch to with update user data
  function onCheck(user: IUser) {
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
            <IconButton
              aria-label="edit"
              onClick={() => setEditMode(!editMode)}
              sx={{
                float: "right",
                color: "#B05219",
                width: "1.8rem",
                height: "1.8rem",
                top: "80%",
                "&:focus": { outline: "none" },
                "&:focus-visible": { outline: "none" },
              }}
            >
              <EditIcon />
            </IconButton>
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
