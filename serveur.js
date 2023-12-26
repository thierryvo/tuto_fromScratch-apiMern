// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: serveur.js
// tuto chaine : https://www.youtube.com/watch?v=SUPDFHuvhRc
// mongoDBaccès: https://www.mongodb.com/cloud/atlas/register
// test        : http://localhost:5000/   (postman)
// test        :  node app.js
//                npm run dev          => lance nodemon, en Utilisant les scripts de package.json ***
// DESCRIPTION :  
//
// installation: npm install express dotenv
//               npm install mongoose validator bcryptjs jsonwebtoken cookie-parser 
//               npm install multer@2.0.0-rc.1
//               npm install nodemon --save-dev                                                                                                
// ==========================================================================================================
// import des modules nécessaires
const express = require('express')
require('dotenv').config({path: './src/config/.env'})

/*****************************************/
/* Initialisation de l'API (du serveur)  */
const appServeur = express();

/*****************************************/
/* Mise en place du paramétrage          */
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }
  appServeur.use(cors(corsOptions));
  appServeur.use(express.json());
  appServeur.use(express.urlencoded({ extended: true }));
  appServeur.use(cookieParser());

  /*
appServeur.use(cors({ 
    origin: ["http://localhost:8080", "http://172.24.89.242:8080", "http://192.168.1.30:8080"],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: "Origin, X-Requested-With, role, Content, Accept, Content-Type, Authorization, x-access-token"
}));  */



/*****************************************/
/* Mise en place du routage              */
const {checkUser, exigerAuthentification} = require('./src/middlewares/auth.middleware');
const userRoutes = require('./src/routes/user.routes') 
const postRoutes = require('./src/routes/post.routes')
// jwt * : * sur toutes les routes !
appServeur.get('*', checkUser);
appServeur.get('/jwtid', exigerAuthentification,  (req, res) => res.status(200).send(res.locals.user._id));
appServeur.get('/', (req, res) => res.send(`Je suis en ligne (APIMERN). Tout est OK.`));
//
appServeur.use('/api/user', userRoutes);
appServeur.use('/api/post', postRoutes);
appServeur.get('*', (req, res) => res.status(501).send("Qu'est-ce que tu fais bon sang de bois!?!")); // 501 ressource non implémenté

/******************************************************************/
/* Démarrer la connexion BASE DE DONNEES    (MongoDB Atlas)       */
require("./src/config/db")

/******************************************************************/
/* Démarrer le serveur: sur port 5000                             */
const port = process.env.PORT; // 5000;
appServeur.listen(port, () => {
    console.log("SERVEUR: APIMERN, demarré sur http://localhost:"+port);
});
