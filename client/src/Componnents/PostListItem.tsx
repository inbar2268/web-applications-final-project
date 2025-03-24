import {
    Avatar,
    Box,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    Typography
  } from "@mui/material";
  import DeleteIcon from "@mui/icons-material/Delete";
  import { IPost } from "../interfaces/post";
  import { IUser } from "../interfaces/user";
  import { LikeIcon } from "./like";
  import CommentPopup from "./Comments";
  import { useSelector } from "react-redux";
  import { selectLoggedUser } from "../Redux/slices/loggedUserSlice";
  
  interface PostListItemProps {
    post: IPost;
    user?: IUser;
    onImageClick: (post: IPost) => void;
    onDeleteClick?: (event: React.MouseEvent, postId: string) => void;
  }
  
  function PostListItem({ post, user, onImageClick, onDeleteClick }: PostListItemProps) {
    const currentUser = useSelector(selectLoggedUser);
    const isUserLoggedIn = !(currentUser.username === "" && currentUser.email === "" && currentUser.password === "");
    const isUsersPost = isUserLoggedIn && currentUser._id === post.userId;
    const commentCount = post.commentsCount || 0;
  
    const handleDeleteButtonClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      if (onDeleteClick) {
        onDeleteClick(event, post._id);
      }
    };
  
    return (
      <ImageListItem
        sx={{ minWidth: "400px" }}
        key={post.image}
        onClick={() => onImageClick(post)}
      >
        <img
          srcSet={`${post.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
          src={`${post.image}?w=248&fit=crop&auto=format`}
          alt={post.title}
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
                  alt={user?.username?.toUpperCase()}
                  src={user?.profilePicture}
                  sx={{ width: 35, height: 35, marginLeft: 2 }}
                />
                {post.title}
              </Box>
            </div>
          }
          position="top"
          actionIcon={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isUsersPost && onDeleteClick && (
                <IconButton
                  aria-label="delete post"
                  onClick={handleDeleteButtonClick}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#ff5252',
                    },
                    '&:focus': {
                      outline: 'none',
                      border: 'none',  
                    },
                    '&:active': {
                      boxShadow: 'none',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
              <LikeIcon post={post} color="white" />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CommentPopup post={post} />
                <Typography 
                  variant="body2" 
                  component="span" 
                  sx={{ 
                    color: 'white', 
                    fontSize: '0.8rem', 
                    marginRight: '4px',
                    fontWeight: 'medium'
                  }}
                >
                  {commentCount}
                </Typography>
              </Box>
            </Box>
          }
          actionPosition="left"
        />
      </ImageListItem>
    );
  }
  
  export default PostListItem;