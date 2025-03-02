import { TextField } from "@mui/material";
import styled from "styled-components";

export const StyledTextField = styled(TextField)(() => ({
  width: "300px",
  "& label": { color: "#B05219" },
  "& input": { color: "#B05219" },
  "& fieldset": { borderColor: "#B05219" },
  "&:hover fieldset": { borderColor: "#E8B08E" },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "#E8B08E",
  },
}));
