import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, Grid, Typography, IconButton, Card, CardContent, Box, CircularProgress } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import NavBar from "./NavBar";
import CustomSnackbar from './CustomSnackbar';

const CRENEAUX = [
  { label: '08:00 - 09:00', value: '08-09' },
  { label: '09:00 - 10:00', value: '09-10' },
  { label: '10:00 - 11:00', value: '10-11' },
];
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

dayjs.locale('fr');

function getMondayOfWeek(date) {
  // Retourne le lundi de la semaine du 'date'
  const d = dayjs(date);
  return d.day() === 0 ? d.subtract(6, 'day') : d.day(1);
}

function getDatesOfCurrentWeek(monday) {
  // Retourne un tableau de 6 dates (lundi à samedi) à partir du lundi donné
  return JOURS.map((_, i) => monday.add(i, 'day'));
}

const BloodTestSchedule = () => {
  const [monday, setMonday] = useState(getMondayOfWeek(dayjs()));
  const [dates, setDates] = useState(getDatesOfCurrentWeek(getMondayOfWeek(dayjs())));
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [medecins, setMedecins] = useState([]);
  const [loadingMedecins, setLoadingMedecins] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // Charger la liste dynamique des médecins
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bloodDoctors"), (querySnapshot) => {
      setMedecins(querySnapshot.docs.map(doc => doc.data().name));
      setLoadingMedecins(false);
    });
    return unsubscribe;
  }, []);

  // Planning en temps réel avec onSnapshot
  useEffect(() => {
    setDates(getDatesOfCurrentWeek(monday));
    setLoading(true);
    const key = monday.format('YYYY-MM-DD');
    const ref = doc(db, 'bloodSchedules', key);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData(snap.data());
      } else {
        setData({});
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [monday]);

  const handleChange = async (jourIdx, creneau, value) => {
    const newData = { ...data, [`${jourIdx}-${creneau}`]: value };
    setData(newData);
    const key = monday.format('YYYY-MM-DD');
    const ref = doc(db, 'bloodSchedules', key);
    await setDoc(ref, newData);
    if (!value) {
      setSnackbarMsg('Médecin retiré du créneau');
    } else {
      setSnackbarMsg('Médecin affecté au créneau');
    }
    setSnackbarOpen(true);
  };

  const handleWeekChange = (delta) => {
    setMonday((prev) => prev.add(delta * 1, 'week'));
  };

  return (
    <>
      <NavBar />
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} md={10} lg={8}>
          <Card elevation={3} sx={{ borderRadius: 4, p: { xs: 1, sm: 2 }, bgcolor: 'background.paper' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <IconButton onClick={() => handleWeekChange(-1)} size="large">
                  <ArrowBackIos />
                </IconButton>
                <Box textAlign="center" flex={1}>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Horaires de prises de sang
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Semaine du {dates[0].format('DD MMMM YYYY')} au {dates[dates.length - 1].format('DD MMMM YYYY')}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleWeekChange(1)} size="large">
                  <ArrowForwardIos />
                </IconButton>
              </Box>
              {loadingMedecins ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>Heures</TableCell>
                        {dates.map((date, idx) => (
                          <TableCell key={idx} align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100' }}>
                            <div style={{ fontWeight: 'bold' }}>{JOURS[idx]}</div>
                            <div style={{ fontSize: 13 }}>{date.format('DD/MM')}</div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {CRENEAUX.map((creneau) => (
                        <TableRow key={creneau.value}>
                          <TableCell sx={{ fontWeight: 600 }}>{creneau.label}</TableCell>
                          {dates.map((_, jourIdx) => (
                            <TableCell key={jourIdx} align="center">
                              <FormControl fullWidth size="small" variant="outlined" sx={{ minWidth: 110 }}>
                                <Select
                                  value={data[`${jourIdx}-${creneau.value}`] || ''}
                                  onChange={(e) => handleChange(jourIdx, creneau.value, e.target.value)}
                                  displayEmpty
                                  disabled={loading}
                                  sx={{ bgcolor: 'background.default', borderRadius: 2 }}
                                >
                                  <MenuItem value=""><em>--</em></MenuItem>
                                  {medecins.map((m) => (
                                    <MenuItem key={m} value={m}>{m}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        severity="success"
      />
    </>
  );
};

export default BloodTestSchedule; 