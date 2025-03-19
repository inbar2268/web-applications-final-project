import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { IPost } from "../interfaces/post";
import { Button, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUsers } from "../Redux/slices/usersSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LikeIcon } from "./like";

interface IRecipeReviewCardProps extends IconButtonProps {
  post: IPost;
}

export default function RecipeReviewCard(props: IRecipeReviewCardProps) {
  const users = useSelector(selectUsers);
  const navigate = useNavigate();
  const [user, setUser] = useState(
    users.find((user) => user._id === props.post.userId)
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageNaturalWidth, setImageNaturalWidth] = useState(0);
  const [imageNaturalHeight, setImageNaturalHeight] = useState(0);

  useEffect(() => {
    setUser(users.find((user) => user._id === props.post.userId));
  }, [users, props.post.userId]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageNaturalWidth(img.naturalWidth);
    setImageNaturalHeight(img.naturalHeight);
    setImageLoaded(true);
    console.log("1");
  };

  return (
    <Card sx={{ width: "100%", maxHeight: "35rem" , minWidth: "300px"}}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500], cursor: "pointer" }}
            aria-label="recipe"
            src={
              users.find((user) => user._id === props.post.userId)?.profilePicture
            }
            onClick={() => navigate(`/profile/${user?._id}`, { state: { user } })}
          ></Avatar>
        }
        title={props.post.title}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          minHeight: "194px",
          maxHeight: "400px",
          minWidth: "300px"
        }}
      >
        <CardMedia
          component="img"
          image={props.post.image}
          alt={props.post.title}
          onLoad={handleImageLoad}
          sx={{
            maxHeight: "400px",
            width: "auto",
            maxWidth: "100%",
            objectFit: imageNaturalWidth < 300 || imageNaturalHeight < 300 ? "contain" : "cover",
            border: imageNaturalWidth < 300 || imageNaturalHeight < 300 ? "1px solid #e0e0e0" : "none",
          }}
        />
      </Box>
      <CardContent
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "15rem",
          "&::-webkit-scrollbar": {
            width: "12px",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#F3E4D7",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#D1A890",
            borderRadius: "8px",
            border: "2px solid #F3E4D7",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#B28A73",
          },
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {props.post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <LikeIcon post={props.post} />
        {/* TODO: SHOW ONLY FOR CONNECTED USER POSTS */}
        <Button
          aria-label="edit"
          // TODO: onClick={() => setEditMode(!editMode)}
          sx={{
            marginLeft: "auto",
            color: "#B05219",
            "&:focus": { outline: "none" },
            "&:focus-visible": { outline: "none" },
          }}
        >
          Edit Post
        </Button>
      </CardActions>
    </Card>
  );
}

