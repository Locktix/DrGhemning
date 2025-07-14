import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Paper, TextField, Button, Alert, Tabs, Tab, Box, InputAdornment, Avatar } from "@mui/material";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CustomSnackbar from "../components/CustomSnackbar";

function LoginPage() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === 0) {
        await signInWithEmailAndPassword(auth, email, password);
        setSnackbar({ open: true, message: "Connexion réussie !", severity: "success" });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSnackbar({ open: true, message: "Inscription réussie !", severity: "success" });
      }
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setError(err.message);
      setSnackbar({ open: true, message: err.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <CustomSnackbar open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} severity={snackbar.severity} />
      <Paper elevation={0} sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 4,
        bgcolor: 'rgba(255,255,255,0.85)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.18)'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 1 }}>
            {tab === 0 ? <LockOpenIcon sx={{ fontSize: 36, color: 'white' }} /> : <PersonAddIcon sx={{ fontSize: 36, color: 'white' }} />}
          </Avatar>
          <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
            {tab === 0 ? "Connexion" : "Inscription"}
          </Typography>
        </Box>
        <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 2 }}>
          <Tab label={<><LockOpenIcon sx={{ mr: 1 }} />Connexion</>} />
          <Tab label={<><PersonAddIcon sx={{ mr: 1 }} />Inscription</>} />
        </Tabs>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            sx={{ borderRadius: 2, bgcolor: 'white' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">@</InputAdornment>,
              sx: { borderRadius: 2 }
            }}
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            sx={{ borderRadius: 2, bgcolor: 'white' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">*</InputAdornment>,
              sx: { borderRadius: 2 }
            }}
          />
          {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3, borderRadius: 2, fontWeight: 600, fontSize: 18, boxShadow: 2 }}
            disabled={loading}
          >
            {tab === 0 ? "Se connecter" : "S'inscrire"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage; 