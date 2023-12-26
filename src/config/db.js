// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: src/config/db.js                                                                                               
// ==========================================================================================================
// import des modules nécessaires
const mongoose = require('mongoose');

// ==============================
// connexion à la BASE DE DONNEES
// ==============================
mongoose.set("strictQuery", false);
//
//
require('dotenv').config({path: './src/config/.env'})
const DBURL = process.env.DBURL; // "mongodb+srv://thivoz:qiDIL2d7rifeHIew@nodetesttask.sqmnygk.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(DBURL)
.then(() => {
    console.log('Connecté à la base MongoDB Atlas.')
})
.catch((err) => {
    console.log('erreur de connexion à la base MongoDB Atlas. err ='+err)
})