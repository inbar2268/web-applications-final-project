import { Badge } from "@mui/material";
import styled from "styled-components";

export const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    backgroundColor: "white",
    color: "#B05219",
    width: 30,
    height: 30,
    borderRadius: "50%",
    display: "flex",
    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
    "&:focus": { outline: "none" },
    "&:focus-visible": { outline: "none" },
  },
  float: "left",
}));
