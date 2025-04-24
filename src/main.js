import './style.css'
import { GigaChatService } from './services/gigachat.js'
import { RecipeManager } from "./RecipeManager";
import { StorageManager } from "./StorageManager";
import {UIManager} from "./UIManager.js";
import {AIManager} from "./AIManager.js";
import {FormManager} from "./FormManager.js";

export const GIGA_AUTH = 'YzE3ODg1Y2QtYmI0NS00OGRkLWJhMzAtMWIwM2Q1OTUyODE0OjY3NGE5YjcyLWQ5YTQtNGFhOC05ZGMwLTQzOTc2N2VmNjdiNA==';

document.addEventListener('DOMContentLoaded', () => {
    const storageManager = new StorageManager();
    const recipeManager = new RecipeManager(storageManager);
    const gigaChatService = new GigaChatService(GIGA_AUTH);

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
    new AIManager(gigaChatService, ingredientsFM, stepsFM);
});
