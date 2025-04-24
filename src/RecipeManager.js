export class RecipeManager {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.recipes = storageManager.load('recipes');
    }

    addRecipe(recipe) {
        this.recipes.push(recipe);
        this.storageManager.save('recipes', this.recipes);
    }

    deleteRecipe(id) {
        this.recipes = this.recipes.filter(recipe => recipe.id !== id);
        this.storageManager.save('recipes', this.recipes);
    }

    findRecipe(id) {
        return this.recipes.find(recipe => recipe.id === id);
    }
}