import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton, Paper, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuIcon from '@mui/icons-material/Menu';

function NavBar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const navLinks = [
    role && ["secrétaire", "médecin", "dev"].includes(role) && {
      text: "Vaccins",
      icon: <VaccinesIcon sx={{ fontSize: 28 }} />, onClick: () => { navigate("/vaccins"); setDrawerOpen(false); }
    },
    role && ["secrétaire", "médecin", "dev"].includes(role) && {
      text: "Prise de sang",
      icon: <AccessTimeIcon sx={{ fontSize: 28 }} />, onClick: () => { navigate("/horaires"); setDrawerOpen(false); }
    },
    role === "dev" && {
      text: "Administration",
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 28 }} />, onClick: () => { navigate("/admin"); setDrawerOpen(false); }
    },
  ].filter(Boolean);

  return (
    <Paper elevation={0} sx={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1200,
      borderRadius: 0,
      bgcolor: 'rgba(255,255,255,0.85)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e3e3e3',
    }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton edge="start" color="primary" onClick={handleDrawerOpen} sx={{ mr: 1 }}>
                <MenuIcon sx={{ fontSize: 32 }} />
              </IconButton>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  flexGrow: 1,
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  fontSize: 20,
                  textAlign: 'center',
                }}
              >
                Dr Ghemning
              </Typography>
              <Box sx={{ ml: 'auto' }}>
                <IconButton onClick={handleMenu} color="primary" sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <AccountCircleIcon sx={{ fontSize: 28, color: 'white' }} />
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem disabled>{user?.email}</MenuItem>
                  <MenuItem disabled>Rôle : {role}</MenuItem>
                  <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                </Menu>
              </Box>
              <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
                <Box sx={{ width: 240 }} role="presentation" onClick={handleDrawerClose}>
                  <List>
                    {navLinks.map((item, idx) => (
                      <ListItem button key={item.text} onClick={item.onClick}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <List>
                    <ListItem button onClick={handleLogout}>
                      <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                      <ListItemText primary="Déconnexion" />
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  flexGrow: 1,
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  fontSize: 24
                }}
              >
                Centre médical Dr Ghemning
              </Typography>
              {role && ["secrétaire", "médecin", "dev"].includes(role) && (
                <>
                  <Button
                    color="primary"
                    component={Link}
                    to="/vaccins"
                    startIcon={<VaccinesIcon sx={{ fontSize: 28 }} />}
                    sx={{
                      mx: 1,
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2.5,
                      fontSize: 18,
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                    }}
                  >
                    Vaccins
                  </Button>
                  <Button
                    color="primary"
                    component={Link}
                    to="/horaires"
                    startIcon={<AccessTimeIcon sx={{ fontSize: 28 }} />}
                    sx={{
                      mx: 1,
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2.5,
                      fontSize: 18,
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                    }}
                  >
                    Prise de sang
                  </Button>
                </>
              )}
              {role === "dev" && (
                <Button
                  color="success"
                  component={Link}
                  to="/admin"
                  startIcon={<AdminPanelSettingsIcon sx={{ fontSize: 28 }} />}
                  sx={{
                    mx: 1,
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2.5,
                    fontSize: 18,
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: 'rgba(56, 142, 60, 0.08)' }
                  }}
                >
                  Administration
                </Button>
              )}
              <Box sx={{ ml: 2 }}>
                <IconButton onClick={handleMenu} color="primary" sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                    <AccountCircleIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem disabled>{user?.email}</MenuItem>
                  <MenuItem disabled>Rôle : {role}</MenuItem>
                  <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Paper>
  );
}

export default NavBar; 