// import './style.css';
// import {RecipeManager} from "./RecipeManager";
// import {StorageManager} from "./StorageManager";
// import {UIManager} from "./UIManager.js";
// import {AIManager} from "./AIManager.js";
// import {FormManager} from "./FormManager.js";
//
// document.addEventListener('DOMContentLoaded', () => {
//     const storageManager = new StorageManager();
//     const recipeManager = new RecipeManager(storageManager);
//
//     const ingredientsFM = new FormManager(
//         document.getElementById('ingredientsFieldset'),
//         document.getElementById('addIngredientBtn'),
//         '.ingredient-item'
//     );
//     const stepsFM = new FormManager(
//         document.getElementById('stepsFieldset'),
//         document.getElementById('addStepBtn'),
//         '.step-item'
//     );
//
//     new UIManager(recipeManager, ingredientsFM, stepsFM);
//     new AIManager(ingredientsFM, stepsFM);
// });


class Recipe {
    constructor({title, id}) {
        this.id = id;
        this.title = title;
    }
}

class Model {
    constructor() {
        this.recipes = [{
            title: 1, id: crypto.randomUUID()
        }, {
            title: 2, id: crypto.randomUUID()
        }];
    }

    bindRecipesChanged(callback) {
        this.onRecipesChanged = callback
    }

    addRecipe(recipeData) {
        const newRecipe = new Recipe(recipeData);

        this.recipes.push(newRecipe);
        this.onRecipesChanged(this.recipes);
    }

    deleteRecipe(id) {
        this.recipes = this.recipes.filter(recipe => recipe.id !== id);
        this.onRecipesChanged(this.recipes);
    }

    getById(id) {
        return this.recipes.find(recipe => recipe.id === id);
    }

    // TODO
    editRecipe() {}
}

class View {
    constructor() {
        this.recipeCards = document.getElementById('recipeCards');
        this.form = document.getElementById('recipeForm');

        this.addRecipeHandler = null;
        this.deleteRecipeHandler = null;
        this.cookRecipeHandler = null;

        this.initListeners();
    }

    initListeners() {
        this.recipeCards.addEventListener('click', event => {
            event.preventDefault();

            const btn = event.target;
            const cardElement = btn.closest('.recipe-card');
            if (!cardElement) return;

            const id = cardElement.dataset.id;

            if (btn.matches('.delete')) {
                this.deleteRecipeHandler && this.deleteRecipeHandler(id);
            }

            if (btn.matches('.cook')) {
                this.cookRecipeHandler && this.cookRecipeHandler(id);
            }
        })

        this.form.addEventListener('submit', event => {
            event.preventDefault();

            // get form data
            this.addRecipeHandler && this.addRecipeHandler({title: 3, id: crypto.randomUUID()})
        })
    }

    bindAddRecipe(handler) {
        this.addRecipeHandler = handler;
    }

    bindDeleteRecipe(handler) {
        this.deleteRecipeHandler = handler;
    }

    bindCookRecipe(handler) {
        this.cookRecipeHandler = handler;
    }

    createRecipeCard(recipe) {
        const template = document.getElementById('recipe-card-template');
        const clone = template.content.cloneNode(true);

        const title = clone.querySelector('.recipe-card__title');

        title.textContent = recipe.title;

        clone.querySelector('.recipe-card').dataset.id = recipe.id;
        return clone;
    }

    render(recipes) {
        while (this.recipeCards.firstChild) {
            this.recipeCards.removeChild(this.recipeCards.firstChild);
        }

        recipes.forEach(recipe => {
            this.recipeCards.appendChild(this.createRecipeCard(recipe));
        });
    }
}

class RecipeController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.modalController = new RecipeDialogController();

        this.onRecipesChanged(this.model.recipes);

        this.view.bindAddRecipe(this.handleAddRecipe.bind(this));
        this.view.bindDeleteRecipe(this.handleDeleteRecipe.bind(this));
        this.view.bindCookRecipe(this.handleCookRecipe.bind(this));

        this.model.bindRecipesChanged(this.onRecipesChanged.bind(this));
    }

    onRecipesChanged(recipes) {
        this.view.render(recipes);
    }

    handleAddRecipe(data) {
        this.model.addRecipe(data);
    }

    handleCookRecipe(id) {
        const recipe = this.model.getById(id);
        this.modalController.open(recipe);
    }

    handleDeleteRecipe(id) {
        this.model.deleteRecipe(id);
    }

    // TODO
    handleEditRecipe() {
        this.model.editRecipe();
    }
}

class RecipeDialogController {
    constructor() {
        this.view = new RecipeDialogView();
    }

    open(recipe) {
        this.view.render(recipe)
    }
}

class RecipeDialogView {
    constructor() {
        this.dialog = document.getElementById('recipeDialog');
    }

    createRecipe(recipe) {
        const template = document.getElementById('recipe-template');
        const clone = template.content.cloneNode(true);

        const title = clone.querySelector('.recipe__title');

        title.textContent = recipe.title;

        const cloneElement = clone.querySelector('.recipe');
        cloneElement.addEventListener('click', event => this.onClick(event));
        cloneElement.dataset.id = recipe.id;

        return cloneElement;
    }

    onClick(event) {
        event.preventDefault();

        const btn = event.target;
        const cardElement = btn.closest('.recipe');
        if (!cardElement) return;

        if (btn.matches('.btn')) {
            this.dialog.close();
        }
    }

    render(recipe) {
        while (this.dialog.firstChild) {
            this.dialog.removeChild(this.dialog.firstChild);
        }

        this.dialog.appendChild(this.createRecipe(recipe));
        this.dialog.showModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RecipeController(new Model(), new View())
});
