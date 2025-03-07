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
import { useState } from "react";
import Logo from "../assets/Logo.svg";
import { logout } from "../services/authService";

const pages = [{ name: "User", path: "/user" }];
const settings = ["Sign In", "Logout"];

function Layout() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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
    navigate("/");
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

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User" src="/static/images/avatar/2.jpg" />
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
                      }
                    }}
                    sx={{
                      margin: "4px 8px",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                      padding: "8px 16px",
                      "&:hover": {
                        backgroundColor: setting === "Logout" ? "rgba(211, 47, 47, 0.08)" : "rgba(25, 118, 210, 0.08)",
                        transform: "translateY(-1px)",
                      },
                    }}
                    component={setting === "Sign In" ? "a" : "li"}
                    href={setting === "Sign In" ? "/signin" : undefined}>
                    <Typography 
                      sx={{ 
                        textAlign: "center", 
                        fontWeight: 500,
                        color: setting === "Logout" ? "error.main" : "text.primary",
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
    </>
  );
}

export default Layout;
