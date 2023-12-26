// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: controleurs/auth.controleur.js
// signup : http://localhost:5000/api/user/inscription
// ==========================================================================================================
// import des modules nécessaires
const User = require('../modeles/user.modele');
const {erreurInscription, erreurLogin} = require('../utils/erreurs.utils')

/*****************************************/
/* inscription  (add User)           PUT */
module.exports.inscription = async (req, res) => {    
    // PUT                                                                                                              ( add: la création est un PUT et non un POST )
    // inscription === CREATION du profil utilisateur              
    const {nom, prenom, pseudo, email, passe, age}  = req.body;
    try {
        // CREATION = User.create()
        const unUser = await User.create({
            nom: nom,
            prenom: prenom,
            pseudo: pseudo,
            email: email,
            passe: passe,
            age: age
        });
        // renvoie au client le résultat: unUser._id
        res.status(201).json({status: "OK", user: unUser._id})
    } catch (error) {
        const oErreur = erreurInscription(error)
        res.status(200).json(oErreur) 
    }
}

/*****************************************/
/* login ( connexion )              POST */
module.exports.login = async (req, res) => {    
    const {email, passe} = req.body;
    try {
        // on va demander au Modèle User de: => réaliser le login()
        const oUser = await User.login(email, passe)
        if (oUser === null) {
            // KO:
            const message = "ERREUR auth.controleur  login: (email/passe) incorrect";
            return res.status(401).json({status: "KO", message: message}) // 401 utilisateur non authentifié            
        }            
        // OK: l'email & le mot de passe sont correct   
        //
        // on va demander au Modèle User de: => générer le token
        const oConnexion = await oUser.genererToken()
        // on renvoie au client (Front) une réponse de connexion        
        const maxAge = 3 * 24 * 60 * 60 * 1000; // 4320000
        res.cookie('jwt', oConnexion.token, { httpOnly: true, maxAge: maxAge })
        res.status(200).json({status: "OK", msg:"login établie", connexion: oConnexion})
    } catch (error) {
        const oErreur = erreurLogin(error)
        res.status(200).json(oErreur)
    }
}

/*****************************************/
/* logout ( DéConnexion )            GET */
module.exports.logout = async (req, res) => { 
    // retirer le token du cookie: jwt
    // + redirection pour que la requête Aboutie
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}