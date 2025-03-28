import { useRef, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import { editPost } from "../services/postsService";
import { uploadImg } from "../services/imageService";
import { selectLoggedUser } from "../Redux/slices/loggedUserSlice";
import { useSelector } from "react-redux";
import { updatePost } from "../Redux/slices/postsSlice";
import { useDispatch } from "react-redux";
import { IPost } from "../interfaces/post";

interface EditPostPageProps {
  handleClose: () => void;
  post: IPost;
  onSubmitResult?: (success: boolean) => void;
  updatePost: (result: IPost) => void;
}

export function EditPostPage(props: EditPostPageProps) {
  const [title, setTitle] = useState(props.post.title);
  const [content, setContent] = useState(props.post.content);
  const [imagePreview, setImagePreview] = useState<string | null>(
    props.post.image
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const loggedUser = useSelector(selectLoggedUser);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editphoto, setEditPhoto] = useState(false);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setEditPhoto(true);
    }
  };

  const handleSubmit = async () => {
    console.log("loggedUser", loggedUser);
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (editphoto) {
      updatephoto();
    } else {
      const imageUrl: string | null = props.post.image;
      const data: IPost = {
        title: title,
        userId: loggedUser?._id,
        _id: props.post._id,
        content: content,
        image: imageUrl,
        likedBy: props.post.likedBy,
        commentsCount: props.post.commentsCount,
      };
      const response = await editPost(props.post._id, data);
      console.log("response", response);

      if (response) {
        dispatch(updatePost(response));
        console.log("Post added successfully", response);
        props.onSubmitResult?.(true);
        props.updatePost(data);
      } else {
        props.onSubmitResult?.(false);
      }
    }
  };

  const updatephoto = async () => {
    if (fileInputRef.current?.files?.[0]) {
      try {
        const imageUrl = await uploadImg(fileInputRef.current?.files?.[0]);
        if (!imageUrl) {
          console.error("Image upload failed");
          props.onSubmitResult?.(false);
          setIsSubmitting(false);
          return;
        }

        const data: IPost = {
          title: title,
          userId: loggedUser?._id,
          _id: props.post._id,
          content: content,
          image: imageUrl,
          likedBy: props.post.likedBy,
          commentsCount: props.post.commentsCount,
        };
        const response = await editPost(props.post._id, data);
        console.log("response", response);

        if (response) {
          dispatch(updatePost(response));
          console.log("Post added successfully", response);
          props.onSubmitResult?.(true);
          props.onSubmitResult?.(false);
        } else {
          props.onSubmitResult?.(false);
        }

        setIsSubmitting(false);
      } catch (error) {
        console.error("Create post failed:", error);
        props.onSubmitResult?.(false);
        setIsSubmitting(false);
      }
    } else {
      props.onSubmitResult?.(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={true} onClose={props.handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40rem",
          maxHeight: "90vh",
          bgcolor: "white",
          borderRadius: "10px",
          boxShadow: 24,
          p: 0,
          outline: "none",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardHeader
            title="Edit Post"
            action={
              <IconButton onClick={props.handleClose}>
                <CloseIcon />
              </IconButton>
            }
            sx={{
              backgroundColor: "#F3E4D7",
              "& .MuiCardHeader-title": {
                fontWeight: 600,
                color: "#B05219",
              },
            }}
          />

          <CardContent
            sx={{
              flexGrow: 1,
              overflowY: "auto",
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
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#B05219",
                    },
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "#B05219",
                  "&.Mui-focused": {
                    color: "#B05219",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Content"
              variant="outlined"
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#B05219",
                    },
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "#B05219",
                  "&.Mui-focused": {
                    color: "#B05219",
                  },
                },
              }}
            />

            <Box
              sx={{
                mb: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              {!imagePreview ? (
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  onClick={handleEditClick}
                  sx={{
                    color: "#B05219",
                    borderColor: "#B05219",
                    "&:hover": {
                      borderColor: "#B05219",
                      backgroundColor: "rgba(176, 82, 25, 0.08)",
                    },
                  }}
                >
                  Upload Image
                </Button>
              ) : (
                <Box sx={{ mt: 2, position: "relative", width: "100%" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -10,
                      right: -10,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      sx={{
                        backgroundColor: "#E8B08E",
                        color: "#B05219",
                        "&:hover": {
                          backgroundColor: "#B05219",
                          color: "white",
                        },
                        "&:focus": { outline: "none" },
                        "&:focus-visible": { outline: "none" },
                      }}
                      onClick={handleEditClick}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      sx={{
                        backgroundColor: "#E8B08E",
                        color: "#B05219",
                        "&:hover": {
                          backgroundColor: "#B05219",
                          color: "white",
                        },
                        "&:focus": { outline: "none" },
                        "&:focus-visible": { outline: "none" },
                      }}
                      onClick={() => setImagePreview(null)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </Box>
          </CardContent>

          <CardActions
            sx={{
              justifyContent: "flex-end",
              p: 2,
              backgroundColor: "#F3E4D7",
            }}
          >
            <Button
              onClick={props.handleClose}
              sx={{
                color: "#777",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSubmit}
              disabled={
                !title.trim() ||
                !content.trim() ||
                !imagePreview ||
                isSubmitting
              }
              sx={{
                backgroundColor: "#E8B08E",
                "&:hover": {
                  backgroundColor: "#B05219",
                },
                "&:disabled": {
                  backgroundColor: "#f0f0f0",
                  color: "#aaa",
                },
              }}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
}
