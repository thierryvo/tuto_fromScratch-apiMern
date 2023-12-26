// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: routes/user.routes.js
// signup : http://localhost:5000/api/user/inscription
// ==========================================================================================================
// import des modules nécessaires
const authControleur = require('../controleurs/auth.controleur')
const userControleur = require('../controleurs/user.controleur')

/*************************************************/
/*** Récupération du routeur d'express           */
const routeur = require('express').Router();

/*************************************************/
/*** Routage de la ressource User                */
// const {exigerAuthentification} = require('../middlewares/auth.middleware');                            ==> voir dans: serveur.js
routeur.put('/inscription', authControleur.inscription);    // put:     insrire un      user            ! put pour ajout ( et non post)
routeur.post('/login', authControleur.login);               // post:    login           user            ! post pour login
routeur.get('/logout', authControleur.logout);              // get:     logout          user            ! get pour logout
//
// CRUD user   ( on a déjà: '/api/user' dans le serveur )
routeur.get('/', userControleur.getAllUsers);               // get:     lecture tous    les user
routeur.get('/:id', userControleur.getOneUser)              // get:     lecture un      user
routeur.patch('/:id', userControleur.updateUser);           // patch:   mise à jour un  user
routeur.patch('/follow/:id', userControleur.follow);        // patch:   mise à jour     suivre...
routeur.patch('/unfollow/:id', userControleur.unfollow);    // patch:   mise à jour     UnSuivre...
routeur.delete('/:id', userControleur.deleteUser)           // delete:  supprimer un    user
//
// upload image de profil:
const multer = require("multer");
const upload = multer();
routeur.post("/upload", upload.single("file"), userControleur.uploadImageUser);


//routeur.post('/utilisateur/logoutall', authentification, UserControleur.logoutAll); // post:    logoutall       user            ! post pour logoutall
          
// Export
module.exports = routeur;