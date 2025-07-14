import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, Fade, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CustomSnackbar from "./CustomSnackbar";

const ROLES = ["membre", "secrétaire", "médecin", "dev"];

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchUsers = async () => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setSnackbar({ open: true, message: "Rôle modifié avec succès !", severity: "success" });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: "Erreur lors du changement de rôle.", severity: "error" });
    }
  };

  const handleDelete = async () => {
    const user = deleteDialog.user;
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.id));
      setSnackbar({ open: true, message: "Utilisateur supprimé.", severity: "success" });
      setDeleteDialog({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: "Erreur lors de la suppression.", severity: "error" });
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
        <Avatar sx={{ bgcolor: '#388e3c', mr: 2 }}>
          <AdminPanelSettingsIcon sx={{ color: 'white', fontSize: 32 }} />
        </Avatar>
        <Typography variant="h5" fontWeight={700} color="success.dark">Gestion des utilisateurs</Typography>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, bgcolor: 'rgba(236,239,241,0.7)', mt: 2, maxHeight: { xs: 320, sm: 500 }, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180 }}>
            <CircularProgress color="success" size={48} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(56,142,60,0.08)' }}>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Rôle</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, i) => (
                <Fade in={true} timeout={500 + i * 120} key={user.id}>
                  <TableRow
                    sx={{
                      transition: 'background 0.2s',
                      '&:hover': { background: 'rgba(56,142,60,0.07)' }
                    }}
                  >
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                        sx={{
                          borderRadius: 2,
                          bgcolor: 'white',
                          fontWeight: 600,
                          minWidth: 120,
                          boxShadow: 1,
                          '& .MuiSelect-select': { py: 1.2 }
                        }}
                      >
                        {ROLES.map(role => (
                          <MenuItem key={role} value={role} sx={{ fontWeight: 500 }}>{role}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => setDeleteDialog({ open: true, user })} sx={{ borderRadius: 2, bgcolor: 'rgba(211,47,47,0.08)', '&:hover': { bgcolor: 'rgba(211,47,47,0.18)' } }}>
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
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
        <DialogTitle>Supprimer l'utilisateur</DialogTitle>
        <DialogContent>
          Es-tu sûr de vouloir supprimer cet utilisateur ?<br />
          <b>{deleteDialog.user?.email}</b>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManager; 