import {generateRecipe} from "./services/giga-chat.js";

function parseRecipeResponse(text) {
    const recipe = {
        title: '',
        category: '',
        ingredients: [],
        steps: [],
        image: ''
    };

    const titleMatch = text.match(/Название:\s*(.+)/);
    const categoryMatch = text.match(/Категория:\s*(.+)/);
    const ingredientsMatch = text.match(/Ингредиенты:\s*((?:- .+\n?)+)/);
    const instructionsMatch = text.match(/Инструкция:\s*((?:\d+\. .+\n?)+)/);
    const imageMatch = text.match(/Изображение:\s*(.+)/);

    if (titleMatch) recipe.title = titleMatch[1].trim();
    if (categoryMatch) {
        const [first = '', ...rest] = categoryMatch[1].trim();
        recipe.category = first.toUpperCase() + rest.join('');
    }

    if (ingredientsMatch) {
        recipe.ingredients = ingredientsMatch[1]
            .split('\n')
            .map(line => line.replace(/^- /, '').trim())
            .filter(line => line.length > 0);
    }

    if (instructionsMatch) {
        recipe.steps = instructionsMatch[1]
            .split('\n')
            .map(line => line.replace(/^\d+\. /, '').trim())
            .filter(line => line.length > 0);
    }

    if (imageMatch) {
        const trimmedImage = imageMatch[1].trim();
        recipe.image = trimmedImage === 'нет изображения' ? null : trimmedImage;
    }

    return recipe;
}

export class AIManager {
    constructor(ingredients, steps) {
        this.ingredients = ingredients;
        this.steps = steps;

        const generateBtn = document.getElementById('generateRecipeBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.handleGenerateRecipe());
        }
    }

    async handleGenerateRecipe() {
        const ingredientsInput = document.getElementById('availableIngredients');
        const ingredients = ingredientsInput.value.trim();

        try {
            const generatedRecipe = await generateRecipe(ingredients);
            const recipe = parseRecipeResponse(generatedRecipe);

            this.fillRecipeForm(recipe);
        } catch (error) {
            console.error('Error generating recipe:', error);
            alert('Failed to generate recipe. Please try again.');
        }
    }

    fillRecipeForm(recipe) {
        const form = document.getElementById('recipeForm');
        const title = form.querySelector('input[name="title"]');
        const category = form.querySelector('select[name="category"]')

        title.value = recipe.title;
        category.value = recipe.category;

        document.querySelectorAll('.ingredient-item').forEach(el => el.remove());
        document.querySelectorAll('.step-item').forEach(el => el.remove());

        recipe.ingredients.forEach(ing => {
            this.ingredients.addItem(ing);
        });

        recipe.steps.forEach(step => {
            this.steps.addItem(step);
        })
    }
}