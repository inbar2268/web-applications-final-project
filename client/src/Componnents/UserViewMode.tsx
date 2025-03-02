import { Avatar, Box, Typography } from "@mui/material";
import { IUser } from "../interfaces/user";

interface IUserViewModeProps {
  user: IUser;
}
function UserViewMode(props: IUserViewModeProps) {
  return (
    <>
      <Avatar
        alt={props.user.username}
        src={props.user?.profilePicture}
        sx={{
          width: "10rem",
          height: "10rem",
          float: "left",
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
          {props.user.username}
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ fontFamily: "monospace" }}>
          {props.user.email}
        </Typography>
      </Box>
    </>
  );
}
export default UserViewMode;
