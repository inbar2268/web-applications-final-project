import { Box, Button, Modal } from "@mui/material";
import RecipeReviewCard from "./imageCard";
import { IPost } from "../interfaces/post";
interface IImageModalProps {
  seletedPost: IPost;
  modalState: boolean;
  setModaleState: (state: boolean) => void;
}

export function ImageModal(props: IImageModalProps) {
  return (
    <Modal
      open={props.modalState}
      onClose={() => props.setModaleState(false)}
      aria-labelledby="user-details-modal"
      aria-describedby="user-details"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40rem",
          bgcolor: "white",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <RecipeReviewCard style={{ margin: "auto" }} post={props.seletedPost} />
        <Button
          onClick={() => props.setModaleState(false)}
          sx={{
            color: "#B05219",
            margin: "auto",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          close
        </Button>
      </Box>
    </Modal>
  );
}
