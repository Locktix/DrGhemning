import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClZeyHKL8O6ESy1tqrrJTn4qkvdr2COro",
  authDomain: "ghemning-bc91e.firebaseapp.com",
  projectId: "ghemning-bc91e",
  storageBucket: "ghemning-bc91e.appspot.com",
  messagingSenderId: "538971526472",
  appId: "1:538971526472:web:b6dc5ebd825e6be037cf7d",
  measurementId: "G-6KBDTNF60T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Gestion du modal
const openFormBtn = document.getElementById('openFormBtn');
const vaccinModal = document.getElementById('vaccinModal');
const closeModal = document.getElementById('closeModal');
const vaccinForm = document.getElementById('vaccinForm');
const tableBody = document.querySelector('#tableVaccins tbody');

// Ajout de la gestion recherche, export, suppression, édition
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');
let vaccinEditId = null;

function ouvrirModal() {
    vaccinModal.style.display = 'flex';
}
function fermerModal() {
    vaccinModal.style.display = 'none';
    vaccinForm.reset();
    vaccinEditId = null;
}
openFormBtn.onclick = ouvrirModal;
closeModal.onclick = fermerModal;
window.onclick = function(event) {
    // Ne rien faire pour empêcher la fermeture en cliquant sur l'overlay
};

// Charger tous les vaccins depuis Firestore
async function chargerVaccins() {
    const querySnapshot = await getDocs(collection(db, "vaccins"));
    return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

// Enregistrer un nouveau vaccin dans Firestore
async function enregistrerVaccin(vaccin) {
    await addDoc(collection(db, "vaccins"), vaccin);
}

// Mettre à jour un vaccin existant
async function modifierVaccin(id, vaccin) {
    await updateDoc(doc(db, "vaccins", id), vaccin);
}

// Supprimer un vaccin de Firestore
async function supprimerVaccin(id) {
    if (!confirm('Confirmer la suppression de ce vaccin ?')) return;
    await deleteDoc(doc(db, "vaccins", id));
    afficherVaccins(searchInput.value);
}

// Préparer l'édition d'un vaccin
function editerVaccin(id, niss, nom) {
    ouvrirModal();
    document.getElementById('niss').value = niss;
    document.getElementById('nomVaccin').value = nom;
    vaccinEditId = id;
}

// Afficher les vaccins dans le tableau
async function afficherVaccins(filtre = "") {
    const vaccins = await chargerVaccins();
    tableBody.innerHTML = '';
    let filtered = vaccins;
    if (filtre) {
        const f = filtre.toLowerCase();
        filtered = vaccins.filter(v => v.niss.includes(f) || v.nom.toLowerCase().includes(f));
    }
    if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">Aucun vaccin encodé.</td></tr>';
        return;
    }
    filtered.forEach((vaccin) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${vaccin.niss}</td><td>${vaccin.date}</td><td>${vaccin.nom}</td><td>
            <button class="action-btn" onclick="window._editerVaccin && window._editerVaccin('${vaccin.id}', '${vaccin.niss}', '${vaccin.nom.replace(/'/g, "\\'")}')">Éditer</button>
            <button class="action-btn" onclick="window._supprimerVaccin && window._supprimerVaccin('${vaccin.id}')">Supprimer</button>
        </td>`;
        tableBody.appendChild(tr);
        tr.classList.add('fade-in-row');
    });
}

// Soumission du formulaire (ajout ou édition)
vaccinForm.onsubmit = async function(e) {
    e.preventDefault();
    const niss = document.getElementById('niss').value.trim();
    const nomVaccin = document.getElementById('nomVaccin').value.trim();
    if (!niss || !nomVaccin) return;
    const date = new Date().toLocaleDateString('fr-BE');
    if (vaccinEditId) {
        await modifierVaccin(vaccinEditId, { niss, date, nom: nomVaccin });
        vaccinEditId = null;
    } else {
        await enregistrerVaccin({ niss, date, nom: nomVaccin });
    }
    afficherVaccins(searchInput.value);
    fermerModal();
};

searchInput.addEventListener('input', function() {
    afficherVaccins(this.value);
});

exportBtn.onclick = async function() {
    const vaccins = await chargerVaccins();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vaccins, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', 'vaccins.json');
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
};

document.addEventListener('DOMContentLoaded', function() {
    afficherVaccins();
});

// Pour que les boutons inline fonctionnent avec ES modules
window._editerVaccin = editerVaccin;
window._supprimerVaccin = supprimerVaccin;

// Animation pour les lignes ajoutées
const style = document.createElement('style');
style.innerHTML = `.fade-in-row { animation: fadeIn 0.5s; }`;
document.head.appendChild(style); 