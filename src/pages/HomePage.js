import React from "react";
import { Container, Typography, Box, Alert, Grid, Card, CardContent, CardActions, Button, CardHeader, Avatar, Grow } from "@mui/material";
import NavBar from "../components/NavBar";
import { useAuth } from "../firebase/AuthContext";
import { useNavigate } from "react-router-dom";
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function HomePage() {
  const { role } = useAuth();
  const navigate = useNavigate();

  const cards = [];
  if (["secrétaire", "médecin", "dev"].includes(role)) {
    cards.push({
      key: "vaccins",
      title: "Gestionnaire de vaccins",
      icon: <VaccinesIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
      description: "Ajouter, éditer et supprimer les vaccins des patients.",
      action: () => navigate("/vaccins"),
      button: "Accéder",
      gradient: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
    });
  }
  if (role === "dev") {
    cards.push({
      key: "admin",
      title: "Administration",
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 48, color: '#388e3c' }} />,
      description: "Gérer les utilisateurs, leurs rôles et les accès.",
      action: () => navigate("/admin"),
      button: "Accéder",
      gradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
    });
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Centre médical Du Dr Ghemning
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6 }}>
          {role === "membre" && (
            <Alert severity="info" icon={false} sx={{ mb: 3, maxWidth: 500, borderRadius: 3, bgcolor: 'rgba(33,150,243,0.08)', color: 'primary.main', fontWeight: 500, fontSize: 18, display: 'flex', alignItems: 'center' }}>
              <VaccinesIcon sx={{ color: 'primary.main', fontSize: 32, mr: 2 }} />
              <span>
                Votre compte est en attente de validation.<br />
                Veuillez contacter l'administrateur pour qu'on vous attribue un rôle spécifique (secrétaire, médecin, dev).
              </span>
            </Alert>
          )}
        </Box>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2, px: { xs: 0, sm: 2, md: 4 } }}>
          {cards.map((card, i) => (
            <Grow in={true} timeout={500 + i * 200} key={card.key}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    minHeight: 260,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: 4,
                    background: card.gradient,
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: '0 16px 40px 0 rgba(31, 38, 135, 0.25)',
                    },
                  }}
                  elevation={0}
                >
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'white', width: 64, height: 64, boxShadow: 2 }}>{card.icon}</Avatar>}
                    title={<Typography variant="h6" sx={{ fontWeight: 700 }}>{card.title}</Typography>}
                    sx={{ pb: 0, pt: 3 }}
                  />
                  <CardContent>
                    <Typography variant="body1" sx={{ color: 'text.secondary', minHeight: 48 }}>{card.description}</Typography>
                  </CardContent>
                  <CardActions sx={{ pb: 3, px: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{ borderRadius: 2, fontWeight: 600, fontSize: 18, boxShadow: 2 }}
                      onClick={card.action}
                    >
                      {card.button}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grow>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default HomePage; 