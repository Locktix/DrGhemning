import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Fade, CircularProgress, Autocomplete } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CustomSnackbar from "./CustomSnackbar";

const VACCIN_OPTIONS = [
  "Boostrix® (GSK)",
  "Engerix B® (GSK)",
  "Gardasil 9® (MSD)",
  "Infanrix‑IPV® (GSK)",
  "MMR‑Vax‑Pro® (MSD)",
  "Nimenrix® (Pfizer)",
  "Prevenar 13® (Pfizer)",
  "Vaxelis® (MSD)"
];

function VaccinManager() {
  const getLocalDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const local = new Date(today.getTime() - offset * 60 * 1000);
    return local.toISOString().split('T')[0];
  };
  const [vaccins, setVaccins] = useState([]);
  const [niss, setNiss] = useState("");
  const [date, setDate] = useState(getLocalDate());
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ niss: "", date: "", nom: "" });
  const [openEdit, setOpenEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "vaccins"), (querySnapshot) => {
      setVaccins(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Validation NISS (11 chiffres)
  const validateNISS = (nissValue) => {
    const nissRegex = /^\d{11}$/;
    return nissRegex.test(nissValue);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!niss || !date || !nom) return;
    if (!validateNISS(niss)) {
      setSnackbar({ open: true, message: "Le NISS doit contenir exactement 11 chiffres.", severity: "error" });
      return;
    }
    try {
      await addDoc(collection(db, "vaccins"), { niss, date, nom });
      setSnackbar({ open: true, message: "Vaccin ajouté avec succès !", severity: "success" });
      setNiss(""); setDate(getLocalDate()); setNom("");
    } catch (err) {
      setSnackbar({ open: true, message: "Erreur lors de l'ajout.", severity: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "vaccins", id));
      setSnackbar({ open: true, message: "Vaccin supprimé.", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Erreur lors de la suppression.", severity: "error" });
    }
  };

  const handleEditOpen = (vaccin) => {
    setEditId(vaccin.id);
    setEditData({ niss: vaccin.niss, date: vaccin.date, nom: vaccin.nom });
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    try {
      await updateDoc(doc(db, "vaccins", editId), editData);
      setSnackbar({ open: true, message: "Vaccin modifié !", severity: "success" });
      setOpenEdit(false);
      setEditId(null);
    } catch (err) {
      setSnackbar({ open: true, message: "Erreur lors de la modification.", severity: "error" });
    }
  };

  return (
    <Box sx={{
      bgcolor: 'rgba(255,255,255,0.7)',
      borderRadius: 4,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(255,255,255,0.18)',
      p: { xs: 1, sm: 2, md: 4 },
      mt: 3,
      mx: { xs: 0, sm: 1, md: 0 }
    }}>
      <CustomSnackbar open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} severity={snackbar.severity} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
          <VaccinesIcon sx={{ color: 'white', fontSize: 32 }} />
        </Avatar>
        <Typography variant="h5" fontWeight={700} color="primary.main">Gestion des vaccins</Typography>
      </Box>
      <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField label="NISS" value={niss} onChange={e => setNiss(e.target.value)} required sx={{ flex: 1, minWidth: 120, borderRadius: 2, bgcolor: 'white' }} />
        <TextField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} InputLabelProps={{ shrink: true }} required sx={{ flex: 1, minWidth: 120, borderRadius: 2, bgcolor: 'white' }} />
        <Autocomplete
          freeSolo
          options={VACCIN_OPTIONS}
          value={nom}
          onInputChange={(e, newValue) => setNom(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Nom du vaccin" required sx={{ flex: 2, minWidth: 160, borderRadius: 2, bgcolor: 'white' }} />
          )}
          sx={{ flex: 2, minWidth: 160 }}
        />
        <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 2, fontWeight: 600, px: 4, boxShadow: 2 }}>Ajouter</Button>
      </Box>
      <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 600, color: 'primary.dark' }}>Liste des vaccins</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, bgcolor: 'rgba(236,239,241,0.7)', mt: 2, maxHeight: { xs: 320, sm: 500 }, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180 }}>
            <CircularProgress color="primary" size={48} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(33,150,243,0.08)' }}>
                <TableCell sx={{ fontWeight: 700 }}>NISS</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nom</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vaccins.map((vaccin, i) => (
                <Fade in={true} timeout={500 + i * 120} key={vaccin.id}>
                  <TableRow
                    sx={{
                      transition: 'background 0.2s',
                      '&:hover': { background: 'rgba(33,150,243,0.07)' }
                    }}
                  >
                    <TableCell>{vaccin.niss}</TableCell>
                    <TableCell>{vaccin.date}</TableCell>
                    <TableCell>{vaccin.nom}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditOpen(vaccin)} sx={{ color: '#1976d2', mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(vaccin.id)} sx={{ color: '#d32f2f' }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Modifier le vaccin</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="NISS" value={editData.niss} onChange={e => setEditData({ ...editData, niss: e.target.value })} required />
          <TextField label="Date" type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} InputLabelProps={{ shrink: true }} required />
          <TextField label="Nom du vaccin" value={editData.nom} onChange={e => setEditData({ ...editData, nom: e.target.value })} required />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
          <Button onClick={handleEditSave} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(33,150,243,0.05)', borderRadius: 3, border: '1px solid rgba(33,150,243,0.2)' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Liens utiles
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              Plateforme officielle e-vax :
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              href="https://www.e-vax.be/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Accéder à e-vax.be
            </Button>
          </Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              Tutoriel d'utilisation e-vax :
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              href="https://www.e-vax.be/VaccHelp/help/pdf/Aide_evax_Enregistrement_VaccinationIndividuelle.pdf"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Télécharger le guide PDF
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default VaccinManager; 