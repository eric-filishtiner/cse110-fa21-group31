// import RecipeClass from "./recipeClass";
// The purpose of this JS file is to take API JSON files, create recipeClass objects with that info, and "send" them out to the website
export default { fillOutRecipe }
// RecipeExpand.js
import { RECIPE_ROUTE, TEMP_EDIT_CREATE_ROUTE, createNodeClone, DISPLAY_BLOCK, DISPLAY_NONE, HOME_ROUTER } from "./util.js"
import { deleteRecipe, fetchRecipeById, addSavedRecipeById, deleteSavedRecipeById } from "./APICalls.js";
import { routerAddEditPage, routerNavigateWrapper, userData } from "./index.js";
const recipeData = {};
const PLACEHOLDER_IMG = window.location.protocol + "//" + window.location.host + "/source/assets/Images/recipeCardPlaceholder.png";

let isSaved = false; // Variable to keep track of saved status

/**
 * Populates the recipe detail pages by fetching recipe json and filling in 
 * properties in html components. 
 */
/*
export async function populateRecipeDetail() {
    const url = parent.document.URL;
    let recipeID = url.substring(url.indexOf('#') + RECIPE_ROUTE.length + 1, url.length);
    // let recipeID = "AJlpmnCbp6gry18v";
    let recipe = await fetchRecipeById(recipeID);
    fillOutRecipe(recipe);
}
*/

export async function fillOutRecipe(data) {
    createNodeClone('saveRecipeButton');
    if (!data) return
    document.getElementById("recipeTitle").innerHTML = data.name;
    if (data.tags) {
        let tagList = document.getElementById("tags");
        //clear old steps
        while (tagList.firstChild) {
            tagList.removeChild(tagList.firstChild);
        }
        for (let i = 0; i < data.tags.length; i++) {
            let item = document.createElement("li");
            tagList.appendChild(item);
            item.innerHTML = data.tags[i];
            /*
            console.log("Ingredient: " + ingredient);
            ingredientsHTML.innerHTML += ingredient + ": " + data.ingredients[ingredient] + "\n";
            */
        }
    }
    // If data.image not valid, use placeholder image
    const image = (data.image == null || typeof data.image == "object" || data.image == "") ?
        PLACEHOLDER_IMG : data.image;
    // If data.image valid but image not exist, suppress error message and use placeholder image
    const imageErrorFunc = `this.onerror=null; this.src='${PLACEHOLDER_IMG}'`;

    document.getElementById("recipeImage").setAttribute("src", image);
    document.getElementById("recipeImage").setAttribute("onerror", imageErrorFunc);
    document.getElementById("date").innerHTML = new Date(data.datePosted * 1000);
    if (data.description) document.getElementById("description").innerHTML = data.description;
    if (data.servingSize) document.getElementById("servingSize").innerHTML = data.servingSize;
    // Now rendering username rather than user id
    if (data.author && data.author.username) document.getElementById("author").innerHTML = data.author.username;
    if (data.cookTime) document.getElementById("cookTime").innerHTML = data.cookTime;
    if (data.ingredients) {
        // console.log("Ingredients object: " + data.ingredients);
        let ingredientsList = document.getElementById("ingr");
        //clear old ingredients
        while (ingredientsList.firstChild) {
            ingredientsList.removeChild(ingredientsList.firstChild);
        }
        for (let ingredient in data.ingredients) {
            let item = document.createElement("li");
            ingredientsList.appendChild(item);
            item.innerHTML = ingredient + ": " + data.ingredients[ingredient];
            /*
            console.log("Ingredient: " + ingredient);
            ingredientsHTML.innerHTML += ingredient + ": " + data.ingredients[ingredient] + "\n";
            */
        }
    }
    //clear old steps
    let stepsList = document.getElementById("stps");
    while (stepsList.firstChild) {
        stepsList.removeChild(stepsList.firstChild);
    }
    for (let i = 0; i < data.steps.length; i++) {
        let item = document.createElement("li");
        stepsList.appendChild(item);
        item.innerHTML = data.steps[i];
    }

    //document.getElementById("steps").innerHTML = data.steps;
    createNodeClone('editRecipeButton');
    createNodeClone('deleteRecipeButton');
    const editRecipeButton = document.getElementById('editRecipeButton')
    const delRecipeButton = document.getElementById('deleteRecipeButton')
    const saveRecipeButton = document.getElementById('saveRecipeButton');
    const page = data._id;
    const routeUrl = TEMP_EDIT_CREATE_ROUTE + page
    if (userData) {
        editRecipeButton.style.display = DISPLAY_BLOCK;
        delRecipeButton.style.display = DISPLAY_BLOCK;
        saveRecipeButton.style.display = DISPLAY_BLOCK;
        routerAddEditPage(routeUrl, data);
        //Saved button
        addSaveButton(data);
        if (userData.myRecipe.find(ele => ele._id == data._id)) {
            editRecipeButton.addEventListener('click', () => {
                //redirect to edit page and populate the page
                routerNavigateWrapper(routeUrl)
            })
            delRecipeButton.addEventListener('click', async () => {
                console.log("Deleting " + data._id);
                //redirect to edit page and populate the page
                await deleteRecipe(data._id);
                if (userData && userData.myRecipe) {
                    userData.myRecipe = userData.myRecipe.filter(function (recipe) {
                        return recipe._id != data._id;
                    });
                    userData.savedRecipe = userData.savedRecipe.filter(function (recipe) {
                        return recipe._id != data._id;
                    });
                }
                routerNavigateWrapper(HOME_ROUTER)
            })
        } else {
            editRecipeButton.style.display = DISPLAY_NONE;
            delRecipeButton.style.display = DISPLAY_NONE;
        }
    } else {
        editRecipeButton.style.display = DISPLAY_NONE;
        delRecipeButton.style.display = DISPLAY_NONE;
        saveRecipeButton.style.display = DISPLAY_NONE;
        console.log(saveRecipeButton.style.display);
    }


}


function convertTime(time) {
    let timeStr = '';

    // Remove the 'PT'
    time = time.slice(2);

    let timeArr = time.split('');
    if (time.includes('H')) {
        for (let i = 0; i < timeArr.length; i++) {
            if (timeArr[i] == 'H') return `${timeStr} hr`;
            timeStr += timeArr[i];
        }
    } else {
        for (let i = 0; i < timeArr.length; i++) {
            if (timeArr[i] == 'M') return `${timeStr} min`;
            timeStr += timeArr[i];
        }
    }

    return '';
}

const saveRecipe = (data) => () => {
    if (isSaved) {
        //styling
        saveRecipeButton.style.background = 'url(/source/assets/Images/Empty_Heart.svg)';
        saveRecipeButton.style.backgroundRepeat = 'no-repeat';
        if (userData && userData.savedRecipe) {
            userData.savedRecipe = userData.savedRecipe.filter(function (recipe) {
                return recipe._id != data._id;
            });
        }
        console.log("Unsaving recipe " + data.name + " with id " + data._id);
        isSaved = false;
        deleteSavedRecipeById(userData._id, data._id);
        console.log('Removed Recipe from saved');
    }
    else {

        //styling
        saveRecipeButton.style.background = 'url(/source/assets/Images/Filled_Heart.svg)';
        saveRecipeButton.style.backgroundRepeat = 'no-repeat';

        if (userData && userData.savedRecipe) {
            userData.savedRecipe.push(data);
        }
        console.log("Saving recipe " + data.name + " with id " + data._id);
        isSaved = true;
        addSavedRecipeById(userData._id, data._id);
        console.log('Added Recipe to saved');
    }
}

function addSaveButton(data) {
    const saveRecipeButton = document.getElementById('saveRecipeButton');
    isSaved = false;
    console.log("data id: " + data._id);
    for (let i = 0; i < userData.savedRecipe.length; i++) {
        if (userData.savedRecipe[i]._id == data._id) {
            isSaved = true;
            break;
        }
    }
    //isSaved = userData.savedRecipe.includes(data._id);

    //Inital check on page load
    if (isSaved) {
        saveRecipeButton.style.background = 'url(/source/assets/Images/Filled_Heart.svg)';
    }
    else {
        saveRecipeButton.style.background = 'url(/source/assets/Images/Empty_Heart.svg)';
    }
    saveRecipeButton.style.backgroundRepeat = 'no-repeat';


    saveRecipeButton.addEventListener('click', saveRecipe(data, isSaved));
}
