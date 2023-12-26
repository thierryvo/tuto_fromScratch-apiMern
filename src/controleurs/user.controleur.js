// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: controleurs/user.controleur.js
// ==========================================================================================================
// import des modules nécessaires
const User = require('../modeles/user.modele');
const ObjectID = require("mongoose").Types.ObjectId; // ID reconnu par la base de données ?
//const fs = require("fs");
//const { promisify } = require("util");
//const pipeline = promisify(require("stream").pipeline); 
//const { erreurUserUploadImage } = require("../utils/erreurs.utils");

/*****************************************/
/* get All Users                     GET */
module.exports.getAllUsers = (req, res) => {
    // GET
    // LECTURE de tout les utilisateurs
    User.find({}).select(['-createdAt', '-updatedAt'])
    .then((tabUtilisateurs) => {
        // on renvoie le tableau des utilisateurs
        res.status(200).json({status: "OK", tabUtilisateurs: tabUtilisateurs}) // status 200 OK        
    })
    .catch((error) => {
        const message = "ERREUR en catch user.controleur getAllUsers)";                                    
        res.status(500).json({status: "KO", message: message + ' ==> error = ' + error }) // 500: erreur interne à l'API
    })           
}

/*****************************************/
/* get One User                      GET */
module.exports.getOneUser = async (req, res) => {
    // GET
    // LECTURE d'un seul utilisateur
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // =====================================================
    try {
        const unUser = await User.findById({"_id": req.params.id})
        if (unUser === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR user.controleur getOneUser: User introuvable)";                                    
            return res.status(404).json({status: "KO", message: message}) // 404 ressource introuvable            
        }
        //
        // OK: on renvoi un seul user
        res.status(200).json({status: "OK", utilisateur: unUser}) // status 200 OK        
    } catch (error) {        
        const message = "ERREUR en catch user.controleur getOneUser)";                                    
        res.status(500).json({status: "KO", message: message + ' ==> error = ' + error }) // 500: erreur interne à l'API
    }       
}

/*****************************************/
/* patch update User               PATCH */
module.exports.updateUser = async (req, res) => {
    // PATCH
    // MISE A JOUR D'un seul utilisateur
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // =====================================================
    const {bio} = req.body;
    try {
        // Update Atlas avec: findOneAndUpdate(1, 2, 3)  3 paramètres
        // 1 : clé
        // 2 : qu'est ce qu'on fait: $SET   ( ici on met à jour la BIO )
        // 3 : Options de mise à jour
        const unUpdate = await User.findOneAndUpdate({"_id": req.params.id}, 
            { $set: {bio: bio} },
            { new: true, upsert: true, setDefaultsOnInsert: true}
        )  
        if (unUpdate === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR user.controleur updateUser: findOneAndUpdate NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        // OK: on renvoi l'Objet de MiseàJour
        res.status(200).json({status: "OK", MiseàJour: unUpdate}) // status 200 OK        
    } catch (error) {        
        const message = "ERREUR en catch user.controleur updateUser)";                                    
        res.status(500).json({status: "KO", message: message + ' ==> error = ' + error }) // 500: erreur interne à l'API
    }     
}

/*****************************************/
/* patch follow                    PATCH */
module.exports.follow = async (req, res) => {
    // PATCH
    // MISE A JOUR follow (  suivre )
    // CONTROLE: id
    const {idToFollow} = req.body;
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    if (!ObjectID.isValid(idToFollow)){
        // ID idToFollow NON Valide
        const message = "ID idToFollow Incorrect : "
        return res.status(400).json({status: "KO", message: message + idToFollow}); // 400 problème dans la requête
    }    
    // =====================================================
    try {
        // 1: Ajout au tableau following:  les gens que l'on suit
        // ================================================================================================
        // Update Atlas avec: findByIdAndUpdate(1, 2, 3)  3 paramètres
        // 1 : clé
        // 2 : qu'est ce qu'on fait: $addToSet   ( ici on met à jour en AJOUTANT une zone: following   )
        // 3 : Options de mise à jour
        const oUpdate1 = await User.findByIdAndUpdate(req.params.id, 
            { $addToSet: {following: idToFollow} },
            { new: true, upsert: true }
        )  
        if (oUpdate1 === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR user.controleur follow: findByIdAndUpdate (1) NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        // 2: Ajout au tableau followers:  les gens qui nous suivent  ( là on inverse les ID )
        // =================================================================================================        
        const oUpdate2 = await User.findByIdAndUpdate(idToFollow, 
            { $addToSet: {followers: req.params.id} },
            { new: true, upsert: true }
        )  
        if (oUpdate2 === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR user.controleur follow: findByIdAndUpdate (2)  NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        //
        // OK: on renvoi l'Objet de MiseàJour (1) & (2)
        const oObjetMiseaJour = {
            Maj_Folllowing: oUpdate1,
            Maj_Folllowers: oUpdate2
        }
        res.status(200).json({status: "OK", msg: "Deux mise à jour effectué: following & followers ", MiseàJour: oObjetMiseaJour}) // status 200 OK        
    } catch (error) {        
        const message = "ERREUR en catch user.controleur follow)";                                    
        res.status(500).json({status: "KO", message: message + ' ==> error = ' + error }) // 500: erreur interne à l'API
    }     
}

/*****************************************/
/* patch unfollow                  PATCH */
module.exports.unfollow = async (req, res) => {
    // PATCH
     // MISE A JOUR follow (  suivre )
    // CONTROLE: id
    const {idToUnFollow} = req.body;
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    if (!ObjectID.isValid(idToUnFollow)){
        // ID idToFollow NON Valide
        const message = "ID idToFollow Incorrect : "
        return res.status(400).json({status: "KO", message: message + idToUnFollow}); // 400 problème dans la requête
    }    
    // =====================================================
    try {
        // 1: Enlever du tableau following:  les gens que l'on suit
        // ================================================================================================
        // Update Atlas avec: findByIdAndUpdate(1, 2, 3)  3 paramètres
        // 1 : clé
        // 2 : qu'est ce qu'on fait: $pull   ( ici on met à jour en ENLEVANT (Retirant) une zone: following   )
        // 3 : Options de mise à jour
        const oUpdate1 = await User.findByIdAndUpdate(req.params.id, 
            { $pull: {following: idToUnFollow} },
            { new: true, upsert: true }
        )  
        if (oUpdate1 === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR user.controleur unfollow: findByIdAndUpdate (1) NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        // 2: Enlever au tableau followers:  les gens qui nous suivent  ( là on inverse les ID )
        // =================================================================================================        
        const oUpdate2 = await User.findByIdAndUpdate(idToUnFollow, 
            { $pull: {followers: req.params.id} },
            { new: true, upsert: true }
        )  
        if (oUpdate2 === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR user.controleur unfollow: findByIdAndUpdate (2)  NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        //
        // OK: on renvoi l'Objet de MiseàJour (1) & (2)
        const oObjetMiseaJour = {
            Maj_Folllowing: oUpdate1,
            Maj_Folllowers: oUpdate2
        }
        res.status(200).json({status: "OK", msg: "Deux mise à jour effectué: following & followers retiré", MiseàJour: oObjetMiseaJour}) // status 200 OK        
    } catch (error) {        
        const message = "ERREUR en catch user.controleur unfollow)";                                    
        res.status(500).json({status: "KO", message: message + ' ==> error = ' + error }) // 500: erreur interne à l'API
    } 
}

/*****************************************/
/* post uploadImageUser             POST */
module.exports.uploadImageUser = async (req, res) => {
    // POST
    // le middleware multer va nous envoyer: le fichier  req.file
    // On va traiter ce req.file
    console.log('ici au dbut')
    console.log(req.body)
    try {
        // Contrôle des formats d'image accéptés          
        //if(req.file.detectedMimeType != "image/jpg" && 
        //   req.file.detectedMimeType != "image/png" && 
        //   req.file.detectedMimeType !=
        //    "image/jpeg"){
            // Format rejeté: ( le throw passe directement au catch)
        //    console.log('erreur 1 -----------------------')
        //    throw Error("(1) Fomat fichier Invalide")
        //}
        // Contrôle de la taille de l'image ( > 500 000 ko )
        //if(req.file.size > 500000){
            // Format rejeté: ( le throw passe directement au catch)
        //    console.log('erreur 2 -----------------------')
        //    throw Error("(2) Taille image > 500 000 ko Invalide")
        //}
        //
        // Traitement du fichier Image ============================================================================================(1)
        //const nomFichier = req.body.pseudo + ".jpg" // on mettra nom du pseudo . jpg
        //await pipeline(
        //    req.file.stream, 
        //    fs.createWriteStream(
        //        `${__dirname}/../client/public/uploads/profil/${nomFichier}`
        //    )
        //);
        // Traitement du fichier Image ============================================================================================(2)
        const {IDutilisateur} = req.body
        if (!ObjectID.isValid(IDutilisateur)){
            // ID NON Valide
            const message = "ID Incorrect : "
            return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
        }
        const nomFichier = "thi.voz.jpg"
        const pictureChemin = "./uploads/profil/"+nomFichier
        const oSav = await User.findByIdAndUpdate(IDutilisateur,
            { $set: {picture: pictureChemin} },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )
        if (oSav === null) {
            // ERREUR: ID non trouvé
            const message = "ERREUR user.controleur uploadImageUser: findByIdAndUpdate NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        res.status(200).json({status: "OK", msg: "Màjour chemin effectué", oSav: oSav}); // status 200 OK             
    } catch (error) {
        // ERREUR
        const oErreur = erreurUserUploadImage(error)      
        return res.status(200).json(oErreur)                         
    }   
}

/*****************************************/
/* delete User                    DELETE */
module.exports.deleteUser = async (req, res) => {
    // DELETE
    // Suppression D'un seul utilisateur
    // CONTROLE: id
    if (!ObjectID.isValid(req.params.id)){
        // ID NON Valide
        const message = "ID Incorrect : "
        return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
    }
    // =====================================================
    try {
        // Delete Atlas avec: deleteOne(id) 
        const unDelete = await User.deleteOne({"_id": req.params.id});        
        if (unDelete === null) {
            // ERREUR: delete
            const message = "ERREUR user.controleur deleteUser: deleteOne() NON Traité)";                                    
            return res.status(500).json({status: "KO", message: message}) // 500: erreur interne à l'API          
        }
        //
        // OK: on renvoi l'Objet de Suppression
        res.status(200).json({status: "OK", msg: "Suppression effectué", Delete: unDelete}) // status 200 OK        
    } catch (error) {        
        const message = "ERREUR en catch user.controleur deleteUser)";                                    
        res.status(500).json({status: "KO", message: message + ' ==> error = ' + error }) // 500: erreur interne à l'API
    }     
}
