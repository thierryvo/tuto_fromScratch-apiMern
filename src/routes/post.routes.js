// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: routes/post.routes.js
// get    : http://localhost:5000/api/post/
// ==========================================================================================================
// import des modules nécessaires
const postControleur = require('../controleurs/post.controleur')
const multer = require("multer");
const upload = multer();

/*************************************************/
/*** Récupération du routeur d'express           */
const routeur = require('express').Router();

/*************************************************/
/*** Routage de la ressource User                */
// const {exigerAuthentification} = require('../middlewares/auth.middleware');                            ==> voir dans: serveur.js
//
// CRUD post       ( on a déjà: '/api/post' dans le serveur )
routeur.put('/', upload.single("file"), postControleur.createPost); // put:     créer un        post            ! put pour ajout ( et non post)
routeur.get('/', postControleur.getAllPosts);                       // get:     lecture tous    les post
routeur.get('/:id', postControleur.getOnePost);                     // get:     lecture un      post
routeur.patch('/:id', postControleur.updatePost);                   // patch:   mise à jour un  post
routeur.delete('/:id', postControleur.deletePost)                   // delete:  supprimer un    post
// like / unlike
routeur.patch('/like-post/:id', postControleur.likePost);                       // like
routeur.patch('/unlike-post/:id', postControleur.unlikePost);                   // unlike
//
// commentaire:
routeur.patch('/create-comment-post/:id', postControleur.createCommentPost);    // patch: créer un        commentaire-post  ! ici que des patch car on bosse en tableau
routeur.patch('/update-comment-post/:id', postControleur.updateCommentPost);    // patch: mise à jour un  commentaire-post
routeur.patch('/delete-comment-post/:id', postControleur.deleteCommentPost);    // patch: supprimer un    commentaire-post
//          
// Export
module.exports = routeur;
