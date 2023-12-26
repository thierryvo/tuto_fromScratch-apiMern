// ==========================================================================================================
// tuto_fromScratch-apiMern  API(CRUD) NodeJS Express                                   http://localhost:5000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\tuto_fromScratch-apiMern
// fichier: utils/erreurs.utils.js
// ==========================================================================================================
//user-------------------------------------------------------------------------------------------------------
module.exports.erreurInscription = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch auth.controleur inscription() (add user)(création)"; 
    let oErreur =  {
        status: "KO", 
        message: '',
        messageInformation: message,
        o_err: err
    }
    //console.log('err --------------')
    //console.log(err)
    //
    if(err.code === 11000){ 
        // clé en double
        let zone = ''
        if(Object.keys(err.keyValue)[0].includes('pseudo')){ zone = 'pseudo' }
        if(Object.keys(err.keyValue)[0].includes('email')){ zone = 'email' }
        oErreur.message = "Ce user est déjà inscrit, clé en double: " + zone
    }
    else {
        // erreur sur zones
        if(err.message.includes('nom')){ oErreur.message = err.errors.nom.properties.message }
        if(err.message.includes('prenom')){ oErreur.message = err.errors.prenom.properties.message }
        if(err.message.includes('pseudo')){ oErreur.message = err.errors.pseudo.message }
        if(err.message.includes('email')){ oErreur.message = err.errors.email.message }
        if(err.message.includes('passe')){ oErreur.message = err.errors.passe.message }
        if(err.message.includes('age')){ oErreur.message = err.errors.age.message }
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}

module.exports.erreurLogin = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch auth.controleur login()"; 
    let oErreur =  {
        status: "KO", 
        message: '',
        messageInformation: message,
        o_err: err
    }
    //
    // erreur sur zones
    if(err.message.includes('email')){ oErreur.message = err.errors.email.message }
    if(err.message.includes('passe')){ oErreur.message = err.errors.passe.message }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}

module.exports.erreurUserUploadImage = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch user.controleur uploadeImageUser"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}

//post-------------------------------------------------------------------------------------------------------
module.exports.erreurPostCreate = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch post.controleur createPost()"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}
module.exports.erreurPostGetAll = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch post.controleur getAllPots()"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}
module.exports.erreurPostGetOne = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch post.controleur getOnePost()"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}
module.exports.erreurPostUpdate = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch post.controleur updatePost()"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}
module.exports.erreurPostLike = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch post.controleur likePost()"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}
module.exports.erreurPostUnLike = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch post.controleur unlikePost()"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}
module.exports.erreurPostDelete = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch post.controleur deletePost()"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}

//comment-post-----------------------------------------------------------------------------------------------
module.exports.erreurCommentPostCreate = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch post.controleur createCommentPost()"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}
module.exports.erreurCommentPostUpdate = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch post.controleur updateCommentPost()"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}
module.exports.erreurCommentPostDelete = (err) => {
    // CREER un objet d'erreur
    const message = "ERREUR en catch post.controleur deleteCommentPost()"; 
    let oErreur =  {
        status: "KO", 
        message: message,
        err: err
    }
    //
    // RETOURNER cet objet d'erreur
    return oErreur
}