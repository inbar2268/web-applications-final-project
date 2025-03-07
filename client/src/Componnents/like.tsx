import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { IPost } from "../interfaces/post";
import { useDispatch, useSelector } from "react-redux";
import { like, unlike } from "../Redux/slices/postsSlice";
import { likePost, unlikePost } from "../services/postsService";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { selectLoggedUser } from "../Redux/slices/loggedUserSlice";

interface LikeProps {
  post: IPost;
}
export const LikeIcon: React.FC<LikeProps> = ({ post }) => {
  const user = useSelector(selectLoggedUser);
  const [userLikedPost, setUserLikedPost] = useState(false);

  useEffect(() => {
    if (user._id) setUserLikedPost(post.likedBy.includes(user._id));
  }, [user]);
  const dispatch = useDispatch();

  function handlelike(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch(like({ postId: post._id, userId: user._id }));
    likePost(post._id, user._id);
    setUserLikedPost(true);
  }
  function handleUnlike(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch(unlike({ postId: post._id, userId: user._id }));
    if (user._id) unlikePost(post._id, user._id);
    setUserLikedPost(false);
  }

  return (
    <>
      {userLikedPost ? (
        <IconButton
          sx={{ color: "red" }}
          aria-label={`star ${post.title}`}
          onClick={handleUnlike}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <FavoriteIcon sx={{ color: "red" }} />
        </IconButton>
      ) : (
        <IconButton
          sx={{ color: "white" }}
          aria-label={`star ${post.title}`}
          onClick={handlelike}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <FavoriteBorderIcon />
        </IconButton>
      )}
    </>
  );
};
