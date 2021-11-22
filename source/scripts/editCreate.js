// This script will take the user's input with their recipe data in editCreate.html, and will send it to the server to be saved.
window.addEventListener("DOMContentLoaded", init);

const url = "http://127.0.0.1:3030/api"

function init() {
    console.log("editCreate.js init called");

    // Adding steps to the recipe
    /* eslint-disable no-unused-vars*/
    const addStepButton = document.querySelector("#addSteps button");
    /* eslint-enable no-unused-vars*/
    //addStepButton.addEventListener('click', appendRow);

    // Submitting the entire recipe
    const recipeForm = document.getElementById("recipeForm");
    recipeForm.onsubmit = onSubmitRecipe;
}

const onSubmitRecipe = async (event) => {
    console.log("SUBMITTED THINGY");
    event.preventDefault();
    let newRecipe = { name: "apple", datePosted: Date.now(), author: "HZRfg63gUu5M8S0F", steps: ["step 1", "step 2"] }

    let response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        body: newRecipe // body data type must match "Content-Type" header
    }).then((response) => response.json())
        .then((data) => {
            // This grabs the data return by the server
            return data
        })
        .catch((err) => {
            console.log(`Error loading the ${recipe} recipe`);
            reject(err);
        });
    //the recipe object received from backend server

    console.log(response)

};

let numSteps = 1;
/* eslint-disable no-unused-vars*/
const appendStep = () => {
    //let d = document.getElementById('steps');
    // d.innerHTML += "<input type='text' id='tst"+ x++ +"'><br >";
    var newTextBox = document.createElement("div");
    newTextBox.innerHTML =
        "<textarea cols='40' rows='4' id='textAreaBox' placeholder='Step #" +
        numSteps +
        "'></textarea>";
    document.getElementById("newStepId").appendChild(newTextBox);
    numSteps++;
};
/* eslint-enable no-unused-vars*/

/* eslint-disable no-unused-vars*/
const deleteStep = () => {
    //newTextBox.classList.add('stepEntry');
    if (document.getElementById("newStepId").lastChild != null) {
        document
            .getElementById("newStepId")
            .removeChild(document.getElementById("newStepId").lastChild);
        numSteps--;
    }
};
/* eslint-enable no-unused-vars*/

/* eslint-disable no-unused-vars*/
const appendIngredient = () => {
    var newTextBox = document.createElement("div");
    newTextBox.innerHTML =
        "<input type='text' id='newInputBox' placeholder='ingredient'>";
    document.getElementById("newIngredientId").appendChild(newTextBox);

    var newAmountBox = document.createElement("div");
    newAmountBox.innerHTML =
        "<input type='text' id='newInputBox' placeholder='amount'>";
    document.getElementById("newIngredientAmountId").appendChild(newAmountBox);
};
/* eslint-enable no-unused-vars*/

/* eslint-disable no-unused-vars*/
const deleteIngredient = () => {
    if (document.getElementById("newIngredientId").lastChild != null) {
        document
            .getElementById("newIngredientId")
            .removeChild(document.getElementById("newIngredientId").lastChild);
        document
            .getElementById("newIngredientAmountId")
            .removeChild(
                document.getElementById("newIngredientAmountId").lastChild
            );
    }
};
/* eslint-enable no-unused-vars*/
