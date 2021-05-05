var cards = []; // Tableau d'objets cartes
let haveIt = []; // Tableau de nombres uniques aléatoire
var nbrRecipes; // Nombre de recettes
var recipes = []; // Tableau des recettes 
var recipesFind = []; // Tableau des recettes trouvées
var arrayIngredientsByRecipe = [];
var cardsElement;
var ingredientsFind = [];
var ingredientsFindByRecipe = [];
var cardsKeepElement = document.getElementsByClassName("ingre-keep");
var cardsKeep = []; // Tableau des ingrédient non gardés
var cardsSweepElement = document.getElementsByClassName("ingre-sweep");
var cardsSweep = []; // Tableau des ingrédient gardés
var nbrRecipesFindElement = document.getElementById("recipes-find");
/*
 * ----------CLASSES----------
 */

/**
 * Card
 */
class Card {
    constructor(title, img, position, angle) {
        this.title = title;
        this.img = img;
        this.position = position;
        this.angle = angle;
    }
}

/**
 * Recipe
 */
class Recipe {
    constructor(title, img, ingredients) {
        this.title = title;
        this.img = img;
        this.ingredients = ingredients;
    }
}

/**
 * Permet d'obtenir un angle aléatoire (pour la rotation des cartes)
 */
const getRandomAngle = (min, max) => Math.random() * (max - min) + min;

/**
 * Permet d'obtenir un nombre unique aléatoire (pour la position des cartes)
 */
const generateUniqueRandom = (max) => {
    let random = Number(Math.floor(Math.random() * max) + 1);
    // Si le chiffre est unique
    if (!haveIt.includes(random)) {
        haveIt.push(random);
        return random;
    } else {
        // Si on a pas atteint le max
        if (haveIt.length < max) {
            // Recursivitée
            return generateUniqueRandom(max);
        } else {
            return false;
        }
    }
}

/**
 * Permet de récupere un fichier JSON
 */
const loadJSON = (file, callback) => {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}

/**
 * Rotation des cartes
 */
const rotateCard = () => {
    // On parcours les cartes d'ingrédients
    for (var i = 0; i < cardsElement.length; i++) {
        // Pour la premier carte (la carte visible)
        if (cardsElement[i].style.zIndex == cardsElement.length) {
            // Il n'y a pas de rotation
            cardsElement[i].style.transform = "rotate(0deg)";
        } else {
            // Pour les autres on utilise la rotation aléatoire
            cardsElement[i].style.transform = "rotate(" + getRandomAngle(-5, 5) + "deg)";
        }
    }
}

/**
 * Ajouter à la liste
 */
const addToList = (list, ingredientName, image) => {
    image = (typeof image === 'undefined') ? 'default' : image;
    var ul = document.getElementById(list);
    var li = document.createElement("li");
    li.textContent = ingredientName;
    if (list == "list-keep") {
        li.classList.add("ingre-keep");
    } else if (list == "list-sweep") {
        li.classList.add("ingre-sweep");
    } else {
        if (ingredientName == "Aucune recette trouvée") {
            li.style.listStyle = "none";
        } else {
            li.classList.add("recipe");
            li.style.listStyle = "disc";
            var img = document.createElement("img");
            img.src = image;
            li.appendChild(img);
        }
    }
    ul.appendChild(li);
}

/**
 * Permet de savoir si la valeur est == true
 */
const isTrue = (currentValue) => currentValue == true;

/**
 * Trouver une recette
 */
const findRecipe = () => {

    recipesFind = [];
    // On parcours les recettes
    for (var i = 0; i < recipes.length; i++) {
        // Remise à zero des tableaux
        ingredientsFind = [];
        ingredientsFindByRecipe = [];

        for (var j = 0; j < recipes[i].ingredients.length; j++) {
            var ingreFind = cardsKeep.includes(recipes[i].ingredients[j]);
            ingredientsFind.push(ingreFind);
        }

        ingredientsFindByRecipe[i] = ingredientsFind;

        if (ingredientsFindByRecipe[i].every(isTrue)) {
            var recipeWithImg = [recipes[i].title, recipes[i].img];
            if (!recipesFind.includes(recipes[i].title)) {
                recipesFind.push(recipeWithImg);
            }
        } else {
            var pos = recipesFind.indexOf(recipes[i].title);
            recipesFind.splice(pos, 1);
        }
    }
    nbrRecipesFindElement.innerHTML = recipesFind.length + " Recettes trouvées";
    recipesFind.sort();
}

/**
 * Ajouter le recette à la liste recette
 */
 const addListRecipe = () => {
    
    var listRecipes = document.getElementById("list-recipes");
    listRecipes.innerHTML = "";

    // Si il n'y a pas de recettes trouvée
    if (recipesFind.length == 0) {
        if (listRecipes.firstChild == null) {
            addToList("list-recipes", "Aucune recette trouvée");
            nbrRecipesFindElement.innerHTML = "0 Recette trouvée";
        }

        // Si il y a des recettes
    } else {

        if (listRecipes.firstChild != null) {
            if (listRecipes.firstChild.textContent == "Aucune recette trouvée") {
                listRecipes.firstChild.remove();
            }
        }

        for (var i = 0; i < recipesFind.length; i++) {
            addToList("list-recipes", recipesFind[i][0], recipesFind[i][1]);
        }
    }
}

/**
 * 
 */
 const firstToLast = () => {
    for (var i = 0; i < cardsElement.length; i++) {
        if (cardsElement[i].style.zIndex == cardsElement.length) {
            cardsElement[i].style.zIndex = 1;
        } else {
            cardsElement[i].style.zIndex++;
        }
    }
}

/**
 * Au clic sur le bouton Sweep
 */
const sweep = () => {
    cardsElement = document.getElementsByClassName("card");
    var cardsSweepElement = document.getElementsByClassName("ingre-sweep");
    var currentIngredient;


    for (var i = 0; i < cardsElement.length; i++) {
        if (cardsElement[i].style.zIndex == cardsElement.length) {
            currentIngredient = cardsElement[i].firstChild.textContent;
        }
    }

    if (cardsSweepElement.length == 0 || !cardsSweep.includes(currentIngredient)) {
        addToList('list-sweep', currentIngredient);
        cardsSweep.push(currentIngredient);
    }

    // Si dans les ingrédient gardé il y a l'ingredient courant
    if (cardsKeep.includes(currentIngredient)) {
        // On supprime l'ingrédient des carte gardées
        var pos = cardsKeep.indexOf(currentIngredient);
        cardsKeep.splice(pos, 1);
    }

    // On supprime l'ingrédient des elements carte gardées
    for (var i = 0; i < cardsKeepElement.length; i++) {
        if (cardsKeepElement[i].firstChild.textContent == currentIngredient) {
            cardsKeepElement[i].parentNode.removeChild(cardsKeepElement[i]);
        }
    }

    findRecipe();
    addListRecipe();
    firstToLast();
    rotateCard();

}

/**
 * Au clic sur le bouton Keep 
 */
const keep = () => {
    cardsElement = document.getElementsByClassName("card");
    var cardsKeepElement = document.getElementsByClassName("ingre-keep");
    var currentIngredient;

    for (var i = 0; i < cardsElement.length; i++) {
        if (cardsElement[i].style.zIndex == cardsElement.length) {
            currentIngredient = cardsElement[i].firstChild.textContent;
        }
    }

    if (cardsKeepElement.length == 0 || !cardsKeep.includes(currentIngredient)) {
        addToList('list-keep', currentIngredient);
        cardsKeep.push(currentIngredient);
    }

    if (cardsSweep.includes(currentIngredient)) {
        var pos = cardsSweep.indexOf(currentIngredient);
        cardsSweep.splice(pos, 1);
    }

    for (var i = 0; i < cardsSweepElement.length; i++) {
        if (cardsSweepElement[i].firstChild.textContent == currentIngredient) {
            cardsSweepElement[i].parentNode.removeChild(cardsSweepElement[i]);
        }
    }

    findRecipe();
    addListRecipe();
    firstToLast();
    rotateCard();
}


/**
 * ----------CALL METHODS----------
 */

/**
 * Appel de la methode loadJSON() pour l'initialisation des cartes ingrédients
 */
loadJSON('ingredients.json', function (response) {
    ingredients = JSON.parse(response); // Tableau des ingrédients du fichier JSON
    var container = document.getElementById('ctn-cards'); // Element qui contient les cartes
    // On parcours les ingrédients
    for (var i = 0; i < ingredients.length; i++) {
        // On crée un objet carte pour touts les ingrédients
        let card = new Card(ingredients[i].name, ingredients[i].img, generateUniqueRandom(ingredients.length), getRandomAngle(-5, 5));
        // On crée les cartes
        var cardElement = document.createElement('div');
        cardElement.classList.add("card");
        cardElement.style.zIndex = card.position;
        // Pour la premier carte (la carte visible)
        if (card.position == ingredients.length) {
            // Il n'y a pas de rotation
            cardElement.style.transform = "rotate(0deg)";
            // Pour les autres on utilise la rotation aléatoire
        } else {
            cardElement.style.transform = "rotate(" + card.angle + "deg)";
        }
        container.appendChild(cardElement);
        // Titre des cartes
        var cardTitleP = document.createElement('p');
        cardTitleP.textContent = ingredients[i].name;
        var cardTitle = document.createElement('div');
        cardTitle.classList.add("card-title");
        cardElement.appendChild(cardTitle);
        cardTitle.appendChild(cardTitleP);
        // Image des cartes
        var cardImg = document.createElement('div');
        cardImg.classList.add("card-img");
        cardImg.style.backgroundImage = "url(" + ingredients[i].img; + "\")";
        cardImg.style.backgroundRepeat = "no-repeat";
        cardImg.style.backgroundSize = "contain";
        cardImg.style.backgroundPosition = "center";
        cardElement.appendChild(cardImg);
        // Boutons des cartes
        var cardBtn = document.createElement('div');
        cardBtn.classList.add("card-btn");
        cardElement.appendChild(cardBtn);
        // Bouton "Sweep"
        var cardBtnS = document.createElement('div');
        cardBtnS.classList.add("btns", "btn-sweep");
        cardBtn.appendChild(cardBtnS);
        // Bouton "Keep"
        var cardBtnK = document.createElement('div');
        cardBtnK.classList.add("btns", "btn-keep");
        cardBtn.appendChild(cardBtnK);
        // Ajouter les évenements au boutons
        cardBtnS.onclick = sweep;
        cardBtnK.onclick = keep;
        // On ajoute l'objet Card crée dans un tableau
        cards.push(card);
    }
});

/**
 * Appel de la methode loadJSON() pour l'initialisation des recettes
 */
loadJSON('recipes.json', function (response) {
    listRecipes = JSON.parse(response);
    nbrRecipes = listRecipes.length;
    // On parcours les recettes
    for (var i = 0; i < nbrRecipes; i++) {
        // On crée un objet Recipe pour chaques recettes
        recipe = new Recipe(listRecipes[i].name, listRecipes[i].img, listRecipes[i].ingredients);
        // On ajoute l'objet crée dans un tableau
        recipes.push(recipe);
    }
});

addListRecipe();