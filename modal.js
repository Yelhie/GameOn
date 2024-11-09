////////// DOM Elements //////////////
//////////////////////////////////////
const modalbg = document.querySelector(".bground");
const modalContent = document.querySelector(".modal-body")
const modalBtn = document.querySelectorAll(".btn-signup");
const iconeMenu = document.querySelector(".icon");
const reductedMenu = document.getElementById("myTopnav");
const closeBtn = document.querySelector(".close");

// éléments DOM du formulaire
const form = document.querySelector("form");
const firstName = document.getElementById("first");
const lastName = document.getElementById("last");
const email = document.getElementById("email");
const dateBirthday = document.getElementById("birthdate");
const quantity = document.getElementById("quantity");
const locationChoice = document.querySelectorAll('input[name="location"]');
const cguCheck = document.getElementById("checkbox1");
// éléments DOM pour l'affichage des erreurs
const errorFirst = document.getElementById("erreurFirst");
const errorLast = document.getElementById("erreurLast");
const errorEmail = document.getElementById("erreurEmail");
const errorDate = document.getElementById("erreurDate");
const errorQuantity = document.getElementById("erreurQuantity");
const errorLocation = document.getElementById("erreurLocation");
const errorCGU = document.getElementById("erreurCheckbox1");

//////// Gestion du menu responsive /////////////
/////////////////////////////////////////////////
/*
fonction qui permet de gérer l'ajout ou le retrait de la classe "responsive" :
quand la classe CSS "responsive" est présente, le menu est affiché
toggle : ajoute la classe passée en paramètre si elle n'est pas présente et sinon la retire
*/
function toggleResponsiveClass() {
    reductedMenu.classList.toggle("responsive");
}

// au clic sur l'icône du menu, la fonction est appelée et permet d'afficher ou de cacher le menu
iconeMenu.addEventListener("click", toggleResponsiveClass);


/////////// Apparition de la modale /////////////
/////////////////////////////////////////////////
// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
    modalbg.style.display = "block";
}

//////// Fermeture de la modale ////////////////
////////////////////////////////////////////////
// création de l'événement : au clic, appel de la fonction "closeModal"
closeBtn.addEventListener("click", closeModal);

//fonction qui repasse la modale en display none : la modale disparait
function closeModal() {
    modalbg.style.display = "none";
}


///// Déclaration des constantes et des fonctions pour le traitement du formulaire /////
////////////////////////////////////////////////////////////////////////////////////////
const regExEmail = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"); // regEx pour une adresse mail
const regExName = new RegExp("^[A-Za-z-]{2,64}$"); //regEx pour avoir au moins 2 lettres et 64 max (accepte le -)
const regExQuantity = new RegExp("^[0-9]{1,3}$"); //regEx pour avoir un nombre entre 1 et 3 chiffres)
const regExDate = new RegExp("^\\d{4}-\\d{2}-\\d{2}$"); //regEx pour les dates au format aaaa/mm/dd

const messages = {
    empty: "Ce champ est obligatoire",
    first: "Le prénom doit comporter au moins 2 caractères",
    last: "Le nom doit comporter au moins 2 caractères",
    email: "L'adresse email n'est pas valide",
    date: "Veuillez entrer une date de naissance valide",
    age: "Tu es trop jeune pour participer",
    quantity: "Veuillez entrer un nombre valide",
    location: "Veuillez sélectionner une ville",
    cgu: "Vous devez accepter les conditions d'utilisation"
};

// création d'un objet servant à stocker les informations du formulaire
const informations = {
    firstName: "",
    lastName: "",
    email: "",
    date: "",
    quantity: "",
    location: "",
    cguChecked: ""
}

// fonction générique pour vérifier un champ à l'aide d'une regEx et gérer l'affichage des messages d'erreur
function verifierChamp(champ, regEx, message, champErreur) {
    if (champ.value.trim() === "") {
        champErreur.innerHTML = messages.empty
        return false;
    } else if (!regEx.test(champ.value.trim())) {
        champErreur.innerHTML = message;
        return false;
    } else {
        champErreur.innerHTML = "";
        return true;
    }
}

// fonction générique de vérification quand on a 1 condition de plus que précédemment
// utiliser pour de date
function verifierDate(champ, regEx, messageRegEx, conditionSecondaire, messageAge, champErreur){
    if (champ.value.trim() === "") {
        champErreur.innerHTML = messages.empty
        return false
    } else if (!regEx.test(champ.value)) {
        champErreur.innerHTML = messageRegEx;
        return false
    } else if (conditionSecondaire) {
        champErreur.innerHTML = messageAge
        return false
    } else {
        champErreur.innerHTML = "";
        return true
    }
}

/////// Vérification des champs AVANT la soumission ////////
////////////////////////////////////////////////////////////
// vérification du Prénom
let checkFirstName = false; // variable servant à enregistrer si le champ est valide ou non
firstName.addEventListener("blur", function () {
    checkFirstName = verifierChamp(firstName, regExName, messages.first, errorFirst);
    // la variable prendra la valeur retournée par la fonction verifierChamp()
});

// vérification du Nom
let checkLastName = false;
lastName.addEventListener("blur", function () {
    checkLastName = verifierChamp(lastName, regExName, messages.last, errorLast);
});

// vérification de l'adresse mail
let checkEmail = false;
email.addEventListener("blur", function () {
    checkEmail = verifierChamp(email, regExEmail, messages.email, errorEmail);
});

// vérification du nombre de tournois
let checkQuantity = false;
quantity.addEventListener("blur", function () {
    checkQuantity = verifierChamp(quantity, regExQuantity, messages.quantity, errorQuantity);
});

// vérification de la date
const oneYearTime = 365 * 24 * 60 * 60 * 1000;  // durée d'une année en milliseconde
const todayTime = new Date().getTime();  // nombre de millisecondes écoulées depuis le premier janvier 1970 à minuit UTC jusqu'au jour actuel

let checkDate = false;
dateBirthday.addEventListener("blur", function () {
    const birthdayNumber = new Date(dateBirthday.value).getTime();  // nombre de millisecondes écoulées jusqu'à la date renseignée
    const age = (todayTime - birthdayNumber) / oneYearTime // "age" de l'inscrit(e)
    const conditionAge = age<15

    checkDate = verifierDate(dateBirthday, regExDate, messages.date, conditionAge, messages.age, errorDate)
});

//////////// Soumission du formulaire /////////////
///////////////////////////////////////////////////
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // on vérifie les cases à cocher ici
    // vérification qu'une ville est sélectionnée
    let CheckLocationSelected = false;
    for (let i = 0; i < locationChoice.length; i++) {
        if (locationChoice[i].checked) {
            CheckLocationSelected = true;
            informations.location = locationChoice[i].value; //on stock la ville choisit dans l'objet
            break;
        }
    }
    if (!CheckLocationSelected) {
        errorLocation.innerHTML = messages.location;
    } else {
        errorLocation.innerHTML = "";
    }

    // vérification que les conditions d'utilisation sont validées
    let cguChecked = false;
    if (!cguCheck.checked) {
        errorCGU.innerHTML = messages.cgu;
    } else {
        errorCGU.innerHTML = "";
        informations.cgu = true;
        cguChecked = true;
    }

    // on vérifie que les autres champs ont été correctement remplis
    // si ce n'est pas le cas, on relance les fonctions de vérification
    // pour voir quel est le problème et pour afficher les messages d'erreur en conséquence
    if(!checkFirstName){
        checkFirstName = verifierChamp(firstName, regExName, messages.first, errorFirst);
    }
    if(!checkLastName){
        checkLastName = verifierChamp(lastName, regExName, messages.last, errorLast);
    }
    if(!checkEmail){
        checkEmail = verifierChamp(email, regExEmail, messages.email, errorEmail);
    }
    if(!checkQuantity){
        checkQuantity = verifierChamp(quantity, regExQuantity, messages.quantity, errorQuantity);
    }
    if(!checkDate){
        const birthdayNumber = new Date(dateBirthday.value).getTime();  // nombre de millisecondes écoulées jusqu'à la date renseignée
        const age = (todayTime - birthdayNumber) / oneYearTime // "age" de l'inscrit(e)
        const conditionAge = age<15

        checkDate = verifierDate(dateBirthday, regExDate, messages.date, conditionAge, messages.age, errorDate)
    }

    // Si tous les champs sont remplis correctement, l'objet informations est rempli avec les valeurs du formulaire
    // Un message de succès s'affiche à l'écran et l'objet est affiché dans la console.
    if (checkFirstName
        && checkLastName
        && checkEmail
        && checkQuantity
        && checkDate
        && CheckLocationSelected
        && cguChecked
    ) {
        informations.firstName = firstName.value.trim();
        informations.lastName = lastName.value.trim();
        informations.email = email.value.trim();
        informations.quantity = quantity.value.trim();
        informations.date = dateBirthday.value.trim();

        let modalSuccess = `
            <div class="div-success"><p> Merci <span>${informations.firstName}</span> !<br> Votre réservation a bien été reçue. </p></div>
            <button class="btn-close">Fermer</button> `

        modalContent.innerHTML = modalSuccess;
        modalContent.classList.add("succes-msg")
        const closeBtn2 = document.querySelector(".btn-close");
        closeBtn2.addEventListener("click", closeModal);

        console.log(informations)
    }
})






