// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: src/modeles/post.modele.js                                                                                               
// ==========================================================================================================
// import des modules necessaire
const mongoose = require('mongoose');
const validator = require('validator');
// modèle (PostSchema)---------------------------------------------------------------------------------------
// clé unique: ?
// tabCommentaires[] contient lui même un Objet avec 4 zones
const PostSchema = new mongoose.Schema(
    {
        userId: {type: String, required: [true, 'userID ID du user qui post est Obligatoire!']},
        message: {type: String, required: [true, 'message est Obligatoire!'], trim: true,
                validate(v) { if (!validator.isLength(v, { min:2, max: 240 })) throw new Error("message non valide! min 2, max 240"); }
        },
        picture: {type: String},
        video: {type: String},
        tabLikers: {type: [String], required: true},
        tabCommentaires: {
                type: [{
                        IDutilisateur: String,
                        pseudoUtilisateur: String,
                        texte: String,
                        timestamp: Number
                }], required: true
        },
    },
    {
      timestamps: true,
    }
  );

// méthode: toJSON, pour cacher passe et tabTokens--------------------------------------------------------------------
PostSchema.methods.toJSON = function() {
    // je me récupère moi même dans une instance
    // et je supprime, dans cette instance, ce que je veux cacher:
    // passe et token & (  delete unUtilisateur._id;  )
    let unPost = this.toObject();    
    delete unPost.__v;
    return unPost;
}
//
// CREER le Modèle à partir du Schéma: (Modèle/Class,  Schéma,  Collection/Table)   
const Post = mongoose.model('Post', PostSchema, 'table-posts');
//
// Export:
module.exports = Post;