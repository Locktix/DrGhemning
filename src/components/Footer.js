import React from 'react';
import { Box, Typography, Grid, Chip, Link } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';
import packageJson from '../../package.json';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const version = packageJson.version;

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'rgba(255,255,255,0.9)',
        borderTop: '1px solid #e3e3e3',
        mt: 'auto',
        py: 3,
        px: { xs: 2, sm: 4 },
        backdropFilter: 'blur(8px)',
        boxShadow: '0 -4px 20px 0 rgba(0,0,0,0.05)',
      }}
    >
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        {/* Informations principales */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            © {currentYear} Centre médical Dr Ghemning
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Développé avec React & Firebase
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Version {version}
          </Typography>
        </Grid>

        {/* Contact et urgence */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Contact: alanplokain@hotmail.be (Dev)
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Urgences: 112
          </Typography>
          <Link 
            href="mailto:alanplokain@hotmail.be" 
            color="primary" 
            underline="hover"
            sx={{ fontSize: '0.875rem' }}
          >
            Nous contacter
          </Link>
        </Grid>

        {/* Statut et conformité */}
        <Grid item xs={12} sm={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <FiberManualRecord sx={{ color: '#4caf50', fontSize: 12 }} />
            <Typography variant="body2" color="text.secondary">
              Système opérationnel
            </Typography>
          </Box>
          <Chip 
            label="Conforme RGPD" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(76, 175, 80, 0.1)', 
              color: '#4caf50',
              fontSize: '0.75rem',
              height: 20
            }} 
          />
        </Grid>
      </Grid>

      {/* Ligne de séparation et mentions légales */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Ce système est destiné à un usage médical professionnel. 
          Toutes les données sont sécurisées et confidentielles.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer; 