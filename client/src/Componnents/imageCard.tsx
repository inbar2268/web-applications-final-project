import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IPost } from "../interfaces/post";
import { mockUsers } from "../mocData";
import { Button } from "@mui/material";

interface IRecipeReviewCardProps extends IconButtonProps {
  post: IPost;
}

export default function RecipeReviewCard(props: IRecipeReviewCardProps) {
  return (
    <Card sx={{ width: "40rem", maxHeight: "35rem" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            aria-label="recipe"
            src={
              mockUsers.find((user) => user.username === props.post.owner)
                ?.profilePicture
            }
          ></Avatar>
        }
        title={props.post.title}
      />
      <CardMedia
        component="img"
        height="194"
        image={props.post.image}
        alt={props.post.title}
      />
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
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>

        
        {/* TODO: SHOW ONLY FOR CONNEXTED USER POSTS */}
        <Button
          aria-label="edit"
          //  TODO:  onClick={() => setEditMode(!editMode)}
          sx={{
            float: "right",
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
