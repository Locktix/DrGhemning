import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const ROLES = ["membre", "secrétaire", "médecin", "dev"];

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  const fetchUsers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "users"));
    setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    fetchUsers();
  };

  const handleDelete = async () => {
    const user = deleteDialog.user;
    if (!user) return;
    await deleteDoc(doc(db, "users", user.id));
    setDeleteDialog({ open: false, user: null });
    fetchUsers();
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
        <Avatar sx={{ bgcolor: '#388e3c', mr: 2 }}>
          <AdminPanelSettingsIcon sx={{ color: 'white', fontSize: 32 }} />
        </Avatar>
        <Typography variant="h5" fontWeight={700} color="success.dark">Gestion des utilisateurs</Typography>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, bgcolor: 'rgba(236,239,241,0.7)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(56,142,60,0.08)' }}>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Rôle</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
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
            ))}
          </TableBody>
        </Table>
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