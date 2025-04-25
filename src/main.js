import './style.css';
import {RecipeManager} from "./RecipeManager";
import {StorageManager} from "./StorageManager";
import {UIManager} from "./UIManager.js";
import {AIManager} from "./AIManager.js";
import {FormManager} from "./FormManager.js";

document.addEventListener('DOMContentLoaded', () => {
    const storageManager = new StorageManager();
    const recipeManager = new RecipeManager(storageManager);

    const ingredientsFM = new FormManager(
        document.getElementById('ingredientsFieldset'),
        document.getElementById('addIngredientBtn'),
        '.ingredient-item'
    );
    const stepsFM = new FormManager(
        document.getElementById('stepsFieldset'),
        document.getElementById('addStepBtn'),
        '.step-item'
    );

    new UIManager(recipeManager, ingredientsFM, stepsFM);
    new AIManager(ingredientsFM, stepsFM);
});
