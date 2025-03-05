import { FC } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { schema, IFormData } from "../interfaces/signUpFrom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/slices/usersSlice";

const SignUp: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = (data: IFormData) => {
    console.log("Form data:", data);
    registerUser(data)
      .then((response) => {
        console.log("Registration successful:", response);
        dispatch(addUser(response));
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: { xs: 2, sm: 3, md: 4 },
          mt: 4,
          mb: 4,
          backgroundColor: "#f4f6f9",
          borderRadius: "10px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "2rem" },
            background: "#E8B08E",
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Sign Up
        </Typography>

        <TextField
          margin="normal"
          label="Username"
          fullWidth
          required
          error={!!errors.username}
          helperText={errors.username ? errors.username.message : ""}
          {...register("username")}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        <TextField
          margin="normal"
          label="Email"
          fullWidth
          required
          type="email"
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
          {...register("email")}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        <TextField
          margin="normal"
          label="Password"
          fullWidth
          required
          type="password"
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ""}
          {...register("password")}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        <Button
          variant="contained"
          fullWidth
          type="submit"
          size="large"
          sx={{
            py: "0.8rem",
            mt: 2,
            mb: 1,
            fontWeight: "bold",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            background: " #E8B08E",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Sign Up
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1">
            Already have an account?{" "}
            <Button
              variant="text"
              component="a"
              href="/signin"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                ml: 1,
                textDecoration: "underline",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              }}
            >
              Sign In
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
