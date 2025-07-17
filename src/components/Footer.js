import React from 'react';
import { Box, Typography, Grid, Chip, Link, Card, CardContent, Avatar } from '@mui/material';
import { 
  FiberManualRecord, 
  Email, 
  Phone, 
  Security, 
  Code, 
  Copyright,
  LocalHospital
} from '@mui/icons-material';
import packageJson from '../../package.json';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const version = packageJson.version;

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: { xs: 1, sm: 2 },
        pt: 3,
        mt: { xs: 2, sm: 3, md: 4 },
        borderTop: '1px solid #eee',
        boxShadow: 'none',
        background: 'rgba(248,249,250,0.85)',
        fontSize: '0.85rem',
        color: '#888',
        opacity: 0.85,
        transition: 'opacity 0.2s',
        '&:hover': { opacity: 1 },
      }}
    >
      <Card 
        elevation={0}
        sx={{
          background: 'transparent',
          borderRadius: 3,
          backdropFilter: 'none',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={3} justifyContent="space-between" alignItems="flex-start">
            {/* Informations principales */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                  <LocalHospital sx={{ color: 'white', fontSize: 24 }} />
                </Avatar>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  Dr Ghemning
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Copyright sx={{ fontSize: 16, mr: 1 }} />
                {currentYear} Centre médical
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Code sx={{ fontSize: 16, mr: 1 }} />
                React & Firebase
              </Typography>
              <Chip 
                label={`v${version}`} 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(25, 118, 210, 0.1)', 
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }} 
              />
            </Grid>

            {/* Contact et urgence */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
                Contact
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                <Link 
                  href="mailto:alanplokain@hotmail.com" 
                  color="primary" 
                  underline="hover"
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.dark' }
                  }}
                >
                  alanplokain@hotmail.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ color: 'error.main', mr: 1, fontSize: 20 }} />
                <Typography variant="body2" color="error.main" fontWeight={600}>
                  Urgences: 112
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Support technique disponible
              </Typography>
            </Grid>

            {/* Statut et conformité */}
            <Grid item xs={12} sm={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
                Statut système
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <FiberManualRecord sx={{ color: '#4caf50', fontSize: 16 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Système opérationnel
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Security sx={{ color: '#4caf50', fontSize: 20 }} />
                <Chip 
                  label="Conforme RGPD" 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(76, 175, 80, 0.1)', 
                    color: '#4caf50',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Données sécurisées et confidentielles
              </Typography>
            </Grid>
          </Grid>

          {/* Ligne de séparation et mentions légales */}
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ lineHeight: 1.5 }}>
              Ce système est destiné à un usage médical professionnel. 
              Toutes les données sont sécurisées, chiffrées et confidentielles.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Footer; 