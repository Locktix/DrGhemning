import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton, Paper } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function NavBar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
              {/* <MenuItem onClick={() => { handleClose(); navigate("/profil"); }}>Profil</MenuItem> */}
              <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Paper>
  );
}

export default NavBar; 