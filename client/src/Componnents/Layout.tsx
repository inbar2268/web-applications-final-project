import { Outlet, Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import Logo from "../assets/Logo.svg";
import { logout } from "../services/authService";
import { logout as logoutRedux } from "../Redux/slices/loggedUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedUser } from "../Redux/slices/loggedUserSlice";
import { AddPostPage } from "./AddPost";
import { Fab, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

// const pages = [{ name: "User", path: "/user" }];
const pages: { name: string; path: string }[] = [];
const settings1 = ["Sign In"];
const settings2 = ["Profile", "Logout"];

function Layout() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const user = useSelector(selectLoggedUser);
  const dispatch = useDispatch();
  const [settings, setSettings] = useState(settings1);
  const [openAddPostModal, setOpenAddPostModal] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  function emptyUser(): boolean {
    if (user.username === "" && user.email === "" && user.password === "")
      return true;
    else return false;
  }

  const isHomeRoute = location.pathname === "/";

  useEffect(() => {
    if (emptyUser()) setSettings(settings1);
    else setSettings(settings2);
  }, [user]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoutClick = () => {
    logout();
    dispatch(logoutRedux());
    navigate("/");
  };

  const handleGenerateRecipe = () => {
    navigate('/generate-recipe');
  };

  const handleAddPostClick = () => {
    setOpenAddPostModal(true); 
  };

  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  const handlePostSubmissionResult = (success: boolean) => {
    setOpenAddPostModal(false); 
    setNotification({
      open: true,
      message: success ? "Post created successfully!" : "Failed to create post. Please try again.",
      severity: success ? "success" : "error"
    });
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#E8B08E" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img
              src={Logo}
              style={{
                width: 80,
                height: 80,
                marginRight: 4,
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                "&:hover": {
                  color: "#B05219",
                },
              }}
            >
              sharEat
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}
            >
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={page.path}
                    sx={{
                      fontFamily: "monospace",
                      "&:hover": {
                        color: "#B05219",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {page.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  to={page.path}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    "&:hover": {
                      color: "#B05219",
                    },
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            {(
              <Tooltip title="Generate Recipe">
                <IconButton
                  onClick={handleGenerateRecipe}
                  sx={{
                    mr: 2,
                    color: "white",
                    "&:hover": {
                      color: "#B05219",
                    },
                  }}
                >
                  <RestaurantMenuIcon />
                </IconButton>
              </Tooltip>
            )}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User" src={user?.profilePicture} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting === "Logout") {
                        handleLogoutClick();
                      } else if (setting === "Profile") {
                        navigate(`/profile/${user?._id}`, { state: { user } });
                      }
                    }}
                    sx={{
                      margin: "4px 8px",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                      padding: "8px 16px",
                      "&:hover": {
                        backgroundColor:
                          setting === "Logout"
                            ? "rgba(211, 47, 47, 0.08)"
                            : "rgba(25, 118, 210, 0.08)",
                        transform: "translateY(-1px)",
                      },
                    }}
                    component={setting === "Sign In" ? "a" : "li"}
                    href={setting === "Sign In" ? "/signin" : undefined}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontWeight: 500,
                        color:
                          setting === "Logout" ? "error.main" : "text.primary",
                      }}
                    >
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ mt: 8 }}>
        <Outlet />
      </Box>
      {isHomeRoute && !emptyUser() && (
        <Fab 
          color="primary" 
          aria-label="add post"
          onClick={handleAddPostClick}
          sx={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            backgroundColor: '#E8B08E',
            '&:hover': {
              backgroundColor: '#B05219',
            },
            '&:active': {
              backgroundColor: '#B05219',
              transform: 'none', 
            },
            boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
          }}
        >
          <AddIcon />
        </Fab>
      )}
      {openAddPostModal && (
        <AddPostPage
          handleClose={() => setOpenAddPostModal(false)}
          onSubmitResult={handlePostSubmissionResult}
        />
      )}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ 
            width: '100%',
            backgroundColor: notification.severity === 'success' ? '#EDF7ED' : '#FDEDED',
            color: notification.severity === 'success' ? '#1E4620' : '#5F2120',
            '& .MuiAlert-icon': {
              color: notification.severity === 'success' ? '#4CAF50' : '#EF5350'
            }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Layout;