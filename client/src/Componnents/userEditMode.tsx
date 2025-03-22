import { useRef, useState } from "react";
import { IUser } from "../interfaces/user";
import { StyledBadge } from "../Styled/StyledBadgeEdit";
import { Avatar, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { StyledTextField } from "../Styled/StyledTextfield";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { uploadImg } from "../services/imageService";
import { editUser } from "../services/usersService";
import { updateLoggedUser } from "../Redux/slices/loggedUserSlice";
import { updateUser } from "../Redux/slices/usersSlice";
import { useDispatch } from "react-redux";

interface IUserEditModeProps {
  user: IUser;
  onCheck: (user: IUser) => void;
  onCancle: () => void;
}
function UserEditMode(props: IUserEditModeProps) {
  const [user, setUser] = useState<IUser>(props.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePicture: previewUrl });
    }
  }

  const handleConfirm = async () => {
    if (fileInputRef.current?.files?.[0]) {
      try {
        const imageUrl = await uploadImg(fileInputRef.current.files[0]);
        console.log(imageUrl);
        if (!imageUrl) {
          console.error("Image upload failed");
          return;
        }
        const updatedUser = { ...user, profilePicture: imageUrl };
        editUser(user._id, updatedUser);
        dispatch(updateLoggedUser(updatedUser));
        dispatch(updateUser(updatedUser));
        props.onCheck(updatedUser);
      } catch (error) {
        console.error("Upload profile picture failed:", error);
      }
    } else {
      editUser(user._id, user);
      dispatch(updateLoggedUser(user));
      dispatch(updateUser(user));
      props.onCheck(user);
    }
  };
  return (
    <>
      <IconButton
        aria-label="edit"
        onClick={() => handleConfirm()}
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
        <CheckIcon />
      </IconButton>
      <IconButton
        aria-label="edit"
        onClick={() => props.onCancle()}
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
        <CloseIcon />
      </IconButton>

      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <IconButton
            sx={{
              backgroundColor: "#E8B08E",
              color: "#B05219",
              "&:hover": { backgroundColor: "#B05219", color: "white" },
              "&:focus": { outline: "none" },
              "&:focus-visible": { outline: "none" },
            }}
            onClick={handleEditClick}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        }
      >
        <Avatar
          alt={user.username}
          src={user?.profilePicture}
          sx={{
            width: "10rem",
            height: "10rem",
          }}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </StyledBadge>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "flex-start",
          color: " #B05219",
          marginTop: 2,
        }}
      >
        <StyledTextField
          label="Username"
          name="username"
          variant="outlined"
          value={user.username}
          onChange={handleChange}
        />
        <StyledTextField
          label="Email"
          name="email"
          variant="outlined"
          value={user.email}
          onChange={handleChange}
        />
      </Box>
    </>
  );
}
export default UserEditMode;
