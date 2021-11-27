// import RecipeClass from "./recipeClass";
// The purpose of this JS file is to take API JSON files, create recipeClass objects with that info, and "send" them out to the website
export default {}
// RecipeExpand.js
import { RECIPE_ROUTE, TEMP_EDIT_CREATE_ROUTE } from "./util.js"
import { deleteRecipe, fetchRecipeById } from "./APICalls.js"
import { routerAddEditPage, routerNavigateWrapper } from "./index.js";
const recipeData = {};

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

export function fillOutRecipe(data) {
    document.getElementById("recipeTitle").innerHTML = data.name;
    if (data.tags) document.getElementById("tags").innerHTML = data.tags;
    document.getElementById("recipeImage").setAttribute("src", data.image);
    document.getElementById("date").innerHTML = new Date(data.datePosted * 1000);
    if (data.description) document.getElementById("description").innerHTML = data.description;
    if (data.servingSize) document.getElementById("servingSize").innerHTML = data.servingSize;
    document.getElementById("author").innerHTML = data.author;
    if (data.cookTime) document.getElementById("cookTime").innerHTML = data.cookTime;
    if (data.ingredients) document.getElementById("ingredients").innerHTML = data.ingredients;
    document.getElementById("steps").innerHTML = data.steps;
    const editRecipeButton = document.getElementById('editRecipeButton')
    const delRecipeButton = document.getElementById('deleteRecipeButton')
    const page = data._id;
    const routeUrl = TEMP_EDIT_CREATE_ROUTE + page
    routerAddEditPage(routeUrl, data)
    editRecipeButton.addEventListener('click', () => {
        //redirect to edit page and populate the page
        routerNavigateWrapper(routeUrl)
    })
    const home = 'home'
    delRecipeButton.addEventListener('click', () => {
        //redirect to edit page and populate the page
        deleteRecipe(data._id)
        routerNavigateWrapper(home)
    })
    /** 
    
    */

    /** 
    document.getElementById("dateOfCreation").innerHTML = searchForKey(
        data,
        "datePublished"
    ).split("T")[0];

    const tagss = getCategories(data).split(",");
    tagss.forEach((tag) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = tag;
        document.getElementById("tags").append(listItem);
    });

    const ingredients = getIngredients(data);
    ingredients.forEach((ingredient) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = ingredient;
        document.getElementById("ingredients").append(listItem);
    });

    const instructions = getInstructions(data);
    instructions.forEach((instruction) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = instruction;
        document.getElementById("steps").append(listItem);
    });
    */
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
}