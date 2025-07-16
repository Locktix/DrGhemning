import React from "react";
import { Container, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import FileManager from "../components/FileManager";

function FileManagerPage() {
  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Gestionnaire de fichiers
        </Typography>
        <FileManager />
      </Container>
    </>
  );
}

export default FileManagerPage; 