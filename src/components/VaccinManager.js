import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VaccinesIcon from '@mui/icons-material/Vaccines';

function VaccinManager() {
  const [vaccins, setVaccins] = useState([]);
  const [niss, setNiss] = useState("");
  const [date, setDate] = useState("");
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ niss: "", date: "", nom: "" });
  const [openEdit, setOpenEdit] = useState(false);

  const fetchVaccins = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "vaccins"));
    setVaccins(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchVaccins();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!niss || !date || !nom) return;
    await addDoc(collection(db, "vaccins"), { niss, date, nom });
    setNiss(""); setDate(""); setNom("");
    fetchVaccins();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "vaccins", id));
    fetchVaccins();
  };

  const handleEditOpen = (vaccin) => {
    setEditId(vaccin.id);
    setEditData({ niss: vaccin.niss, date: vaccin.date, nom: vaccin.nom });
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    await updateDoc(doc(db, "vaccins", editId), editData);
    setOpenEdit(false);
    setEditId(null);
    fetchVaccins();
  };

  return (
    <Box sx={{
      bgcolor: 'rgba(255,255,255,0.7)',
      borderRadius: 4,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(255,255,255,0.18)',
      p: { xs: 2, md: 4 },
      mt: 3
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
          <VaccinesIcon sx={{ color: 'white', fontSize: 32 }} />
        </Avatar>
        <Typography variant="h5" fontWeight={700} color="primary.main">Gestion des vaccins</Typography>
      </Box>
      <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField label="NISS" value={niss} onChange={e => setNiss(e.target.value)} required sx={{ flex: 1, minWidth: 120, borderRadius: 2, bgcolor: 'white' }} />
        <TextField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} InputLabelProps={{ shrink: true }} required sx={{ flex: 1, minWidth: 120, borderRadius: 2, bgcolor: 'white' }} />
        <TextField label="Nom du vaccin" value={nom} onChange={e => setNom(e.target.value)} required sx={{ flex: 2, minWidth: 160, borderRadius: 2, bgcolor: 'white' }} />
        <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 2, fontWeight: 600, px: 4, boxShadow: 2 }}>Ajouter</Button>
      </Box>
      <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 600, color: 'primary.dark' }}>Liste des vaccins</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, bgcolor: 'rgba(236,239,241,0.7)' }}>
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
            {vaccins.map((vaccin) => (
              <TableRow
                key={vaccin.id}
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
            ))}
          </TableBody>
        </Table>
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
    </Box>
  );
}

export default VaccinManager; 