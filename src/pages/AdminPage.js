import React, { useEffect, useState } from "react";
import { Container, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Fade } from "@mui/material";
import NavBar from "../components/NavBar";
import UserManager from "../components/UserManager";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import CustomSnackbar from "../components/CustomSnackbar";

function AdminPage() {
  // Gestion des médecins pour les prises de sang
  const [medecins, setMedecins] = useState([]);
  const [newMedecin, setNewMedecin] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, medecin: null });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bloodDoctors"), (querySnapshot) => {
      setMedecins(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleAddMedecin = async (e) => {
    e.preventDefault();
    if (!newMedecin.trim()) return;
    await addDoc(collection(db, "bloodDoctors"), { name: newMedecin.trim() });
    setNewMedecin("");
    setSnackbar({ open: true, message: "Médecin ajouté !", severity: "success" });
  };

  const handleDeleteMedecin = async (id) => {
    await deleteDoc(doc(db, "bloodDoctors", id));
    setSnackbar({ open: true, message: "Médecin supprimé.", severity: "success" });
    setDeleteDialog({ open: false, medecin: null });
  };

  const handleEditOpen = (medecin) => {
    setEditId(medecin.id);
    setEditName(medecin.name);
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    await updateDoc(doc(db, "bloodDoctors", editId), { name: editName });
    setOpenEdit(false);
    setEditId(null);
    setSnackbar({ open: true, message: "Médecin modifié !", severity: "success" });
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <UserManager />
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
              <PersonIcon sx={{ color: 'white', fontSize: 32 }} />
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="primary.main">Gestion des médecins pour les prises de sang</Typography>
          </Box>
          <Box component="form" onSubmit={handleAddMedecin} sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <TextField label="Nom du médecin" value={newMedecin} onChange={e => setNewMedecin(e.target.value)} required sx={{ flex: 2, minWidth: 160, borderRadius: 2, bgcolor: 'white' }} />
            <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 2, fontWeight: 600, px: 4, boxShadow: 2 }}>Ajouter</Button>
          </Box>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, bgcolor: 'rgba(236,239,241,0.7)', mt: 2, maxWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(25,118,210,0.08)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Nom</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medecins.map((medecin, i) => (
                  <Fade in={true} timeout={500 + i * 120} key={medecin.id}>
                    <TableRow
                      sx={{
                        transition: 'background 0.2s',
                        '&:hover': { background: 'rgba(25,118,210,0.07)' }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}><PersonIcon sx={{ color: 'white', fontSize: 20 }} /></Avatar>
                          {medecin.name}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEditOpen(medecin)} sx={{ color: '#1976d2', mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => setDeleteDialog({ open: true, medecin })} sx={{ color: '#d32f2f', borderRadius: 2, bgcolor: 'rgba(211,47,47,0.08)', '&:hover': { bgcolor: 'rgba(211,47,47,0.18)' } }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
            <DialogTitle>Modifier le médecin</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Nom du médecin" value={editName} onChange={e => setEditName(e.target.value)} required />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
              <Button onClick={handleEditSave} variant="contained">Enregistrer</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, medecin: null })}>
            <DialogTitle>Supprimer le médecin</DialogTitle>
            <DialogContent>
              Es-tu sûr de vouloir supprimer ce médecin ?<br />
              <b>{deleteDialog.medecin?.name}</b>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog({ open: false, medecin: null })}>Annuler</Button>
              <Button onClick={() => handleDeleteMedecin(deleteDialog.medecin.id)} color="error" variant="contained">Supprimer</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </>
  );
}

export default AdminPage; 