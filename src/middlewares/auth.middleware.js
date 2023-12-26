// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: middlewares/auth.middleware.js
// ==========================================================================================================
// import des modules nécessaires
const jwt = require('jsonwebtoken');
const User = require('../modeles/user.modele');

// checkUser: tester si l'utilisateur est bien connecté
module.exports.checkUser = async (req, res, next) => {
    // 1: Vérifier la présence du token (dans les cookies / ou header)
    // 2: Décoder le token sous try-catch
    // 3: Vérifier l'utilisateur présent dans le token, il doit être peésent en base
    // 4: ok on stock le user, le token, + next
    //
    // 1:
    const authToken = req.cookies.jwt
    //  c......log('token du get:'+authToken)
    if (authToken === null) {
        // ERREUR Absence de token !
        res.locals.user = null;
        const message = "ERREUR d'authentification: Merci de vous connecter!";
        return res.status(401).json({status: "KO", message: message}) // 401 utilisateur non authentifié
    }
    // 2:
    const phraseSecrète = process.env.JWT_SECRET; //'foo'
    let decodeToken = undefined;
    try {
        decodeToken = await jwt.verify(authToken, phraseSecrète);
    } catch (error) {
        // KO
        const message = "ERREUR d'authentification: Merci de vous connecter!";
        res.locals.user = null;
        res.cookie('jwt', '', {maxAge: 1});
        return res.status(401).json({status: "KO", message: message}) // 401 utilisateur non authentifié
    }
    if (decodeToken===undefined) {
        // KO, le client FRONT est déjà informé de l'ERREUR, voir ci-dessus
        res.locals.user = null;
        const message = "ERREUR d'authentification: Merci de vous connecter!";
        return res.status(401).json({status: "KO", message: message}) // 401 utilisateur non authentifié
    } 
    // 3:
    const unUser = await User.findById({"_id": decodeToken._id})
    if (unUser === null) {
        // KO
        res.locals.user = null;
        const message = "ERREUR d'authentification: Merci de vous connecter!";
        return res.status(401).json({status: "KO", message: message}) // 401 utilisateur non authentifié
    }
    //
    // ok on stock le user, le token
    // on done l'authentification à la requête en cours: next()
    res.locals.user = unUser
    next();
}

// exigerAuthentification: c'est ce qui va BLOQUER les routes à  protéger lorque le user n'est pas connecté
module.exports.exigerAuthentification = async (req, res, next) => {
    // 1: Vérifier la présence du token (dans les cookies / ou header)
    // 2: Décoder le token sous try-catch
    // 3: Vérifier l'utilisateur présent dans le token, il doit être présent en base
    // 4: ok on stock le user, le token, + next
        // 1:
        const authToken = req.cookies.jwt        
        if (authToken === null) {
            // ERREUR Absence de token !
            res.locals.user = null;
            const message = "ERREUR d'authentification: Merci de vous connecter!";
            return res.status(401).json({status: "KO", message: message}) // 401 utilisateur non authentifié
        }
        // 2:
        const phraseSecrète = process.env.JWT_SECRET; //'foo'
        let decodeToken = undefined;
        try {
            decodeToken = await jwt.verify(authToken, phraseSecrète);
        } catch (error) {
            // KO
            const message = "ERREUR d'authentification: Merci de vous connecter!";
            res.locals.user = null;
            res.cookie('jwt', '', {maxAge: 1});
            return res.status(401).json({status: "KO", message: message, erreur: error}) // 401 utilisateur non authentifié
        }
        if (decodeToken===undefined) {
            // KO, le client FRONT est déjà informé de l'ERREUR, voir ci-dessus
            res.locals.user = null;
            const message = "ERREUR d'authentification: Merci de vous connecter!";
            return res.status(401).json({status: "KO", message: message}) // 401 utilisateur non authentifié
        } 
        // 3:
        const unUser = await User.findById({"_id": decodeToken._id})
        if (unUser === null) {
            // KO
            res.locals.user = null;
            const message = "ERREUR d'authentification: Merci de vous connecter!";
            return res.status(401).json({status: "KO", message: message}) // 401 utilisateur non authentifié
        }
        //
        // ok on stock le user, le token
        // on done l'authentification à la requête en cours: next()
        res.locals.user = unUser
        next();
}