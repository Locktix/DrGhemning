import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, List, ListItem, ListItemIcon, ListItemText, IconButton, LinearProgress, ListItemSecondaryAction, CircularProgress } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import { ref, uploadBytesResumable, listAll, getDownloadURL, deleteObject, getMetadata } from "firebase/storage";
import CustomSnackbar from "./CustomSnackbar";
import { storage } from "../firebase/firebaseConfig";
import { db, auth } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

function FileManager() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTaskRef, setUploadTaskRef] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    const q = query(collection(db, "files"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setFiles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);

    const user = auth.currentUser;
    const fileRef = ref(storage, `gestionnaire/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);
    setUploadTaskRef(uploadTask);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        setSnackbar({ open: true, message: "Erreur lors de l'upload", severity: "error" });
        setUploading(false);
        setUploadTaskRef(null);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "files"), {
            fileUrl: url,
            fileName: file.name,
            fileType: file.type,
            uploadedBy: user ? user.uid : "anonyme",
            createdAt: serverTimestamp(),
            storagePath: uploadTask.snapshot.ref.fullPath,
          });
          setSnackbar({ open: true, message: "Fichier envoyé !", severity: "success" });
        } catch (err) {
          setSnackbar({ open: true, message: "Erreur lors de l'enregistrement", severity: "error" });
        }
        setUploading(false);
        setUploadProgress(0);
        setUploadTaskRef(null);
        fetchFiles();
      }
    );
    e.target.value = "";
  };

  const handleCancelUpload = () => {
    if (uploadTaskRef) {
      uploadTaskRef.cancel();
      setUploading(false);
      setUploadProgress(0);
      setUploadTaskRef(null);
      setSnackbar({ open: true, message: "Envoi annulé", severity: "info" });
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors du téléchargement", severity: "error" });
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm("Supprimer ce fichier ?")) return;
    try {
      await deleteObject(ref(storage, file.storagePath));
      await deleteDoc(doc(db, "files", file.id));
      setSnackbar({ open: true, message: "Fichier supprimé", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de la suppression", severity: "error" });
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3, mt: 2 }}>
      <CustomSnackbar open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} severity={snackbar.severity} />
      <Typography variant="h6" gutterBottom>
        Gestion des fichiers
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
          disabled={uploading}
        >
          Ajouter un fichier
          <input type="file" hidden onChange={handleFileChange} disabled={uploading} />
        </Button>
        {uploading && (
          <Box flex={1} display="flex" alignItems="center" gap={2}>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ minWidth: 120, flex: 1 }} />
            <Typography variant="body2" color="text.secondary">{uploadProgress}%</Typography>
            <Button onClick={handleCancelUpload} color="error" size="small">
              Annuler
            </Button>
          </Box>
        )}
      </Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Fichiers stockés :</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {files.length === 0 && <Typography>Aucun fichier pour l'instant.</Typography>}
          {files.map((file) => (
            <ListItem key={file.id} divider secondaryAction={
              <Box>
                <IconButton href={file.fileUrl} target="_blank" rel="noopener noreferrer" edge="end">
                  <DownloadIcon />
                </IconButton>
                <IconButton edge="end" color="error" onClick={() => handleDelete(file)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }>
              <ListItemIcon>
                <InsertDriveFileIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={file.fileName}
                secondary={
                  <>
                    {file.fileType && <span>{file.fileType} — </span>}
                    {file.createdAt?.toDate
                      ? file.createdAt.toDate().toLocaleString()
                      : ""}
                    {file.uploadedBy && (
                      <span> — Ajouté par {file.uploadedBy}</span>
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default FileManager; 