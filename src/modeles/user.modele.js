// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: src/modeles/user.modele.js                                                                                               
// ==========================================================================================================
// import des modules necessaire
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// modèle (UserSchema)--------------------------------------------------------------------------------------
// clé unique:
// - pseudo
// - email
const UserSchema = new mongoose.Schema(
    {
        nom: {type: String, required: [true, 'le nom est Obligatoire!'],trim: true,
                validate(v) { if (!validator.isLength(v, { min:3, max: 55 })) throw new Error("nom non valide! min 3, max 55"); }
        },
        prenom: {type: String, required: [true, 'le prenom est Obligatoire!'], trim: true,
                validate(v) { if (!validator.isLength(v, { min:3, max: 55 })) throw new Error("prenom non valide! min 3, max 55"); }
        },
        pseudo: {type: String, required: [true, 'le pseudo est Obligatoire!'], trim: true, unique: true,
                validate(v) { if (!validator.isLength(v, { min:3, max: 55 })) throw new Error("pseudo non valide! min 3, max 55"); }
        },
        email: {type: String, required: [true, 'email est Obligatoire!'], lowercase: true, trim: true, unique: true,
                validate(v) { if (!validator.isEmail(v)) throw new Error("email non valide!"); }
        },
        passe: {type: String, required: [true, 'le passe est Obligatoire!'],
                validate(v) { if (!validator.isLength(v, { min:4, max: 100 })) throw new Error("passe non valide! min 4, max 100"); }
        },
        age: {type: Number, required: [true, 'l age est Obligatoire!'],
                validate(v) { if (v < 0) throw new Error("L'age doit être positif!"); }
        },
        picture: {type: String, default: "./uploads/profil/random-user.png"},
        bio :{type: String, max: 1024},
        followers: {type: [String]},
        following: {type: [String]},
        likes: {type: [String]}
    },
    {
      timestamps: true,
    }
  );

// méthode: toJSON, pour cacher passe et tabTokens--------------------------------------------------------------------
UserSchema.methods.toJSON = function() {
    // je me récupère moi même dans une instance
    // et je supprime, dans cette instance, ce que je veux cacher:
    // passe et token & (  delete unUtilisateur._id;  )
    let unUtilisateur = this.toObject();    
    delete unUtilisateur.passe;
    delete unUtilisateur.__v;
    return unUtilisateur;
}
// Midlleware sure save() ---------------------------------------------------------------------------------------------
// crypter le mot de passe au moment (juste avant) du save 
UserSchema.pre('save', async function(next) {
        // hashage du mot de passe, avec un salage de: 8 -- le salage ajoute des mots en plus au mot de passe avant de crypter.
        // Le principe du hashage du mot de passe c’est le principe de la carotte rappée, plus elle est rappée, 
        // plus c’est difficile de reconstituer les morceaux, surtout si tu y mets les doigts dedans !
        if(this.isModified('passe')){
                // const salt = await bcrypt.genSalt();
                this.passe = await bcrypt.hash(this.passe, 8);
        }
        next();
});
//
// login ---------------------------------------------------------------------------------------------------------------
UserSchema.statics.login = async function(email, passe) {
        // En statics: s'utilise avec la classe, exemple: User.login(email, passe)
        const oUtilisateur = await User.findOne({"email": email});
        if(oUtilisateur === null){ return null; }
        //
        // COMPARER les mot de passe (mot de passe saisie & mot de passe du user enregistré en base)?
        const testPasse = await bcrypt.compare(passe, oUtilisateur.passe);
        if(testPasse == false){ return null; }
        //
        // OK
        // si ca passe on renvoie le user
        return oUtilisateur;
}
//
// générer le token ----------------------------------------------------------------------------------------------------
UserSchema.methods.genererToken = async function() {
        // En methods: s'utiliser avec l'Objet, exemple: oUser.genererToken()
        // GENERER le token d authentification--------------------------------------------
        require('dotenv').config({path: '../config/.env'})
        const phraseSecrète = process.env.JWT_SECRET; //'foo'
        const duree = process.env.JWT_DUREE; // 4 hour
        const token = jwt.sign({ 
                _id: this._id.toString(),
                nom: this.nom,
                prenom: this.prenom,
                pseudo: this.pseudo,
                email: this.email
        }, phraseSecrète, { expiresIn: duree });
        // AJOUTER le token d authentification à: Utilisateur en train de se connecter (moi)
        // this.tabTokens.push({ token })
        // SAUVEGARDER l'Utilisateur avec son token --------------------------------------
        //const oSav = await this.save();
        //
        const oConnexion = {
                _id: this._id.toString(),
                token: token,
                sauvegarde: "pas pour l instant"
        }
        return (oConnexion);
}
//
// CREER le Modèle à partir du Schéma: (Modèle/Class,  Schéma,  Collection/Table)   
const User = mongoose.model('User', UserSchema, 'table-users');
//
// Export:
module.exports = User;