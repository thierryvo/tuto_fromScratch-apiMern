// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: controleurs/post.controleur.js
// ==========================================================================================================
// import des modules nécessaires
const Post = require('../modeles/post.modele');
const User = require('../modeles/user.modele');
const ObjectID = require("mongoose").Types.ObjectId; // ID reconnu par la base de données ?
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline); 
const { erreurUserUploadImage } = require("../utils/erreurs.utils");
const {erreurPostCreate, erreurPostGetAll, erreurPostGetOne, erreurPostUpdate, erreurPostDelete} = require('../utils/erreurs.utils')
const {erreurPostLike, erreurPostUnLike} = require('../utils/erreurs.utils')
const {erreurCommentPostCreate, erreurCommentPostUpdate, erreurCommentPostDelete} = require('../utils/erreurs.utils')

/*****************************************/
/* création (add Post)               PUT */
module.exports.createPost = async (req, res) => {    
    // PUT                                                                            ( add: la création est un PUT et non un POST )
    // CREATION du Post ( un message posté par un user )
    const {userId, message, video}  = req.body;
    // Gestion du fichier image
    let nomFichier="";
    if(req.file != null){
        // Contrôle des formats d'image accéptés          
        if(req.file.detectedMimeType != "image/jpg" && 
           req.file.detectedMimeType != "image/png" && 
           req.file.detectedMimeType != "image/jpeg"){
            // Format rejeté: ( le throw passe directement au catch)
            console.log('erreur 1 -----------------------')
            //throw Error("(1) Fomat fichier Invalide")
            const message = "ERREUR post.controleur createPOst: (1) Fomat fichier Invalide";
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API     
        }
        //Contrôle de la taille de l'image ( > 500 000 ko )
        if(req.file.size > 500000){
            // Format rejeté: ( le throw passe directement au catch)
            console.log('erreur 2 -----------------------')
            //throw Error("(2) Taille image > 500 000 ko Invalide")
            const message = "ERREUR post.controleur createPOst: (2) Taille image > 500 000 ko Invalide";
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API     
        }        
        // Traitement du fichier Image ============================================================================================(1)
        nomFichier = userId + Date.now() + ".jpg" 
        await pipeline(
            req.file.stream, 
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/posts/${nomFichier}`
            )
        );
    }
    // Création d'un objet Post
    let wPicrure = ""
    if(req.file != null){ wPicrure = "./uploads/posts/" + nomFichier }
    const oPost = new Post({
        userId: userId,
        message: message,
        picture: wPicrure,
        video: video,
        tabLikers: [],
        tabCommentaires: []
    });
    try {
        // Sauvegarde dans MongoDB
        // + renvoie au client le résultat de sauvegarde: savPost
        const savPost = await oPost.save()
        res.status(201).json({status: "OK", savPost: savPost})
    } catch (error) {
        const oErreur = erreurPostCreate(error)
        res.status(200).json(oErreur) 
    }
}

/*****************************************/
/* get All Posts                     GET */
module.exports.getAllPosts = (req, res) => {
    // GET
    // LECTURE de tout les posts                             createdAt: -1 pour trier en Décroissant
    Post.find({}).select(['-createdAt', '-updatedAt']).sort({createdAt: -1})
    .then((tabPosts) => {
        // on renvoie le tableau des Posts
        res.status(200).json({status: "OK", tabPosts: tabPosts}) // status 200 OK        
    })
    .catch((error) => {
        const oErreur = erreurPostGetAll(error)
        res.status(200).json(oErreur) 
    })           
}

/*****************************************/
/* get One Post                      GET */
module.exports.getOnePost = async (req, res) => {
    // GET
    // LECTURE d'un seul post
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // =====================================================
    try {
        const unPost = await Post.findById({"_id": req.params.id})
        if (unPost === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur getOnePost: Post introuvable)";                                    
            return res.status(404).json({status: "KO", message: message}) // 404 ressource introuvable            
        }
        //
        // OK: on renvoi un seul post
        res.status(200).json({status: "OK", post: unPost}) // status 200 OK        
    } catch (error) {        
        const oErreur = erreurPostGetOne(error)
        res.status(200).json(oErreur) 
    }       
}

/*****************************************/
/* patch update Post               PATCH */
module.exports.updatePost = async (req, res) => {
    // PATCH
    // MISE A JOUR D'un seul post
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // =====================================================
    const {message} = req.body;
    try {
        // Update Atlas avec: findOneAndUpdate(1, 2, 3)  3 paramètres
        // 1 : clé
        // 2 : qu'est ce qu'on fait: $SET   ( ici on met à jour la BIO )
        // 3 : Options de mise à jour
        const oUpdateENREG = {
            message: message
        }
        const unUpdate = await Post.findByIdAndUpdate(req.params.id, 
            { $set: oUpdateENREG },
            { new: true }
        )  
        if (unUpdate === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur updatePost: findByIdAndUpdate NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        // OK: on renvoi l'Objet de MiseàJour
        res.status(200).json({status: "OK", MiseàJour: unUpdate}) // status 200 OK        
    } catch (error) {
        const oErreur = erreurPostUpdate(error)
        res.status(200).json(oErreur)
    }     
}

/*****************************************/
/* delete Post                    DELETE */
module.exports.deletePost = async (req, res) => {
    // DELETE
    // Suppression D'un seul post
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // =====================================================
    try {
        // Delete Atlas avec: deleteOne(id) 
        const unDelete = await Post.findByIdAndDelete(req.params.id);        
        if (unDelete === null) {
            // ERREUR: delete
            const message = "ERREUR post.controleur deletePost: findByIdAndDelete() NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        // OK: on renvoi l'Objet de Suppression
        res.status(200).json({status: "OK", msg: "Suppression effectué", Delete: unDelete}) // status 200 OK        
    } catch (error) {
        const oErreur = erreurPostDelete(error)
        res.status(200).json(oErreur)        
    }     
}

/*****************************************/
/* patch update like Post          PATCH */
module.exports.likePost = async (req, res) => {
    // PATCH
    // MISE A JOUR like:  aimmer un message & mettre à jour des 2 côtés ========================================> 2 miseàJour
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // Post / tabLikers ================================================================================================ (1)
    const {IDutilisateur} = req.body;
    try {
        // Update Atlas avec: findOneAndUpdate(1, 2, 3)  3 paramètres
        // 1 : clé
        // 2 : qu'est ce qu'on fait: $addToSet   ( ici on ajoute dans un tableau )
        // 3 : Options de mise à jour
        const unUpdate1 = await Post.findByIdAndUpdate(req.params.id, 
            { $addToSet: {tabLikers: IDutilisateur} },
            { new: true }
        )  
        if (unUpdate1 === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur likePost: Post.findByIdAndUpdate tabLikers NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        // Post / likes ================================================================================================ (2)
        const unUpdate2 = await User.findByIdAndUpdate(IDutilisateur, 
            { $addToSet: {likes: req.params.id} },
            { new: true }
        )  
        if (unUpdate2 === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur likePost: User.findByIdAndUpdate likes NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        // OK: on renvoi l'Objet des DEUX  MiseàJour
        const oLikeUpdate = {
            postUpdate: unUpdate1,
            userUpdate: unUpdate2
        }
        res.status(200).json({status: "OK", MiseàJour: oLikeUpdate}) // status 200 OK        
    } catch (error) {
        const oErreur = erreurPostLike(error)
        res.status(200).json(oErreur)
    }    
}

/*****************************************/
/* patch update unlike Post        PATCH */
module.exports.unlikePost = async (req, res) => {
    // PATCH
    // MISE A JOUR unlike:  NE plus aimmer un message & mettre à jour des 2 côtés ============================> 2 miseàJour
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // Post / tabLikers ================================================================================================ (1)
    const {IDutilisateur} = req.body;
    try {
        // Update Atlas avec: findOneAndUpdate(1, 2, 3)  3 paramètres
        // 1 : clé
        // 2 : qu'est ce qu'on fait: $pull   ( ici on enlève un élément du tableau )
        // 3 : Options de mise à jour
        const unUpdate1 = await Post.findByIdAndUpdate(req.params.id, 
            { $pull: {tabLikers: IDutilisateur} },
            { new: true }
        )  
        if (unUpdate1 === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur unlikePost: Post.findByIdAndUpdate tabLikers NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        // Post / likes ================================================================================================ (2)
        const unUpdate2 = await User.findByIdAndUpdate(IDutilisateur, 
            { $pull: {likes: req.params.id} },
            { new: true }
        )  
        if (unUpdate2 === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur unlikePost: User.findByIdAndUpdate likes NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        // OK: on renvoi l'Objet des DEUX  MiseàJour
        const oLikeUpdate = {
            postUpdate: unUpdate1,
            userUpdate: unUpdate2
        }
        res.status(200).json({status: "OK", MiseàJour: oLikeUpdate}) // status 200 OK        
    } catch (error) {
        const oErreur = erreurPostUnLike(error)
        res.status(200).json(oErreur)
    }
}

/*****************************************/
/* create comment post             PATCH */
module.exports.createCommentPost = async (req, res) => {
    // PATCH
    // MISE A JOUR tabCommentaire:  CREER un commentaire dans ce tableau 
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // Post / Ajouter un commentaire dans: tabCommentaires ======================================================= (1)
    const {IDutilisateur} = req.body;       // ID     de la personne qui à fait le commentaire
    const {pseudoUtilisateur} = req.body;   // pseudo de la personne qui à fait le commentaire
    const {texte} = req.body;               // texte du commentaire
    //
    try {
        // Update Atlas avec: findOneAndUpdate(1, 2, 3)  3 paramètres
        // 1 : clé
        // 2 : qu'est ce qu'on fait: $push   ( ici on ajoute ,push,  dans un tableau, un objet commentaire )
        // 3 : Options de mise à jour
        const oCommentaire = {
            IDutilisateur: IDutilisateur,
            pseudoUtilisateur: pseudoUtilisateur,
            texte: texte,
            timestamp: new Date().getTime()
        }
        const unUpdate = await Post.findByIdAndUpdate(req.params.id, 
            { $push: {tabCommentaires: oCommentaire} },
            { new: true }
        )  
        if (unUpdate === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur createCommentPost: Post.findByIdAndUpdate push tabCommentaires NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        // OK: on renvoi l'Objet de MiseàJour
        res.status(200).json({status: "OK", MiseàJour: unUpdate}) // status 200 OK        
    } catch (error) {
        const oErreur = erreurCommentPostCreate(error)
        res.status(200).json(oErreur)
    }    
}

/*****************************************/
/* update comment post             PATCH */
module.exports.updateCommentPost = async (req, res) => { 
    // PATCH
    // MISE A JOUR tabCommentaire:  MODIFIER un commentaire dans ce tableau 
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // Post / Modifier un commentaire dans: tabCommentaires ======================================================= (1)
    const {IDduCommentaire} = req.body;     // ID     du commentaire à modifier
    const {texte} = req.body;               // texte du commentaire
    //
    try {
        // 1: il faut d'abord retrouver le Post
        const unPost  = await Post.findById(req.params.id)
        if (unPost === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur updateCommentPost: Post.findById Post NON Trouvé)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        // 2: il faut ensuite retrouver le commentaire de ce Post dans le tableau
        const unCommentaire  = unPost.tabCommentaires.find((itemComment) =>
            itemComment._id.equals(IDduCommentaire)
        );
        if (unCommentaire === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur updateCommentPost: unCommentaire.findOne Comment NON Trouvé)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        //
        // 3: Mettre à jour le commentaire que l'on vient de trouver
        //    et sauvegarder
        unCommentaire.texte = texte
        const unUpdate = await unPost.save()  
        if (unUpdate === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur updateCommentPost: unPoste.save Post NON Sauvegardé)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        // OK: on renvoi l'Objet de MiseàJour
        res.status(200).json({status: "OK", MiseàJour: unUpdate}) // status 200 OK        
    } catch (error) {
        console.log(error)
        const oErreur = erreurCommentPostUpdate(error)
        res.status(200).json(oErreur)
    }    
}

/*****************************************/
/* delete comment post             PATCH */
module.exports.deleteCommentPost = async (req, res) => {
    // PATCH
    // MISE A JOUR tabCommentaire:  SUPPRIMMER un commentaire dans ce tableau 
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // Post / Supprimer un commentaire dans: tabCommentaires ===================================================== (1)
    const {IDduCommentaire} = req.body;     // ID     du commentaire à modifier
    //
    try {        
        // Update Atlas avec: findOneAndUpdate(1, 2, 3)  3 paramètres
        // 1 : clé
        // 2 : qu'est ce qu'on fait: $pull   ( ici on enlève un élement du tableau aussi par _id )
        // 3 : Options de mise à jour
        const unUpdate = await Post.findByIdAndUpdate(req.params.id, 
            { $pull: { tabCommentaires: {_id: IDduCommentaire } }  },
            { new: true }
        )  
        if (unUpdate === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR post.controleur updatePost: findByIdAndUpdate NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        // OK: on renvoi l'Objet de MiseàJour
        res.status(200).json({status: "OK", MiseàJour: unUpdate}) // status 200 OK
    } catch (error) {
        console.log(error)
        const oErreur = erreurCommentPostUpdate(error)
        res.status(200).json(oErreur)
    }
}