import React from 'react';
import packageJson from '../../package.json';
import { IconButton, Tooltip, Box, Paper } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const version = packageJson.version;

  return (
    <Paper elevation={0} sx={{
      position: 'static',
      left: 0,
      right: 0,
      borderRadius: 0,
      bgcolor: 'rgba(255,255,255,0.85)',
      boxShadow: '0 -8px 32px 0 rgba(31, 38, 135, 0.10)',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid #e3e3e3',
      mt: 'auto',
      zIndex: 1200,
    }} component="footer">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 1, sm: 4 },
          py: 1.5,
          minHeight: 56,
          flexWrap: 'wrap',
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        {/* Centre (vide pour centrage) */}
        <Box sx={{
          order: { xs: 1, sm: 2 },
          flex: 1,
          mb: { xs: 1, sm: 0 },
          fontSize: { xs: '0.98em', sm: '1.05em' },
          color: 'text.secondary',
          fontWeight: 500,
          width: { xs: '100%', sm: 'auto' },
        }}>
          {/* Vide pour centrage */}
        </Box>

        {/* Gauche (nom/logo) */}
        <Box sx={{
          order: { xs: 2, sm: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          minWidth: 0,
          mb: { xs: 1, sm: 0 },
        }}>
          <LocalHospitalIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Box sx={{ fontWeight: 700, color: 'primary.main', fontSize: { xs: 15, sm: 18 }, letterSpacing: 1 }}>
            Centre médical Dr Ghemning
          </Box>
        </Box>

        {/* Droite (icônes + version) */}
        <Box sx={{
          order: { xs: 3, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-end' },
          minWidth: 0,
          mb: { xs: 0.5, sm: 0 },
        }}>
          <Tooltip title="Contact mail">
            <IconButton
              href="mailto:alanplokain@hotmail.com"
              target="_blank"
              rel="noopener"
              sx={{ color: 'primary.main', mx: 0.5, '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' } }}
              size="large"
            >
              <EmailIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="GitHub">
            <IconButton
              href="https://github.com/Locktix"
              target="_blank"
              rel="noopener"
              sx={{ color: 'primary.main', mx: 0.5, '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' } }}
              size="large"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Version : v${version}`}>
            <IconButton
              sx={{ color: 'primary.main', mx: 0.5, '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' } }}
              size="large"
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default Footer; 