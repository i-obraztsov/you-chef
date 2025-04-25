import {readFileAsDataUrl} from "./lib/read-file-as-data-url.js";

export class UIManager {
    constructor(recipeManager, ingredients, steps) {
        this.recipeManager = recipeManager;
        this.form = document.getElementById('recipeForm');
        this.recipeCards = document.getElementById('recipeCards');
        this.dialog = document.getElementById('recipeDialog');
        this.paginationContainer = document.getElementById('pagination');

        this.currentPage = 1;
        this.recipesPerPage = 6;

        this.ingredientsFM = ingredients;
        this.stepsFM = steps;

        this.initializeEventListeners();
        this.renderRecipes();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const imageFile = formData.get('image');

        try {
            const imageData = await readFileAsDataUrl(imageFile);

            const recipe = {
                id: crypto.randomUUID(),
                title: formData.get('title'),
                ingredients: this.ingredientsFM.getValues(),
                steps: this.stepsFM.getValues(),
                category: formData.get('category'),
                createdAt: new Intl.DateTimeFormat('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).format(new Date()),
                imageUrl: imageData.url,
                imageTitle: imageData.title
            };

            console.log(recipe)

            this.recipeManager.addRecipe(recipe);
            this.resetForm();
            this.renderRecipes();
        } catch (error) {
            console.error(error);
        }
    }

    createRecipeCard(recipe) {
        const card = document.createElement('article');
        card.className = 'recipe-card';

        card.innerHTML = `
            <header class="recipe-card__header">
                <h3 class="recipe-card__title">${recipe.title || 'Без названия'}</h3>
                <div class="recipe-card__meta">
                    <span class="badge recipe-card__category">
                        ${recipe.category || '—'}
                    </span>
                  <time
                    class="recipe-card__date"
                    datetime="${new Date().toISOString().split('T')[0]}"
                  >
                    ${recipe.createdAt || ''}
                  </time>
                </div>
             </header>
             
            <figure class="recipe-card__image-wrapper">
                ${ recipe.imageUrl
                    ? `<img
                        class="recipe-card__image"
                        src="${recipe.imageUrl}"
                        alt="${recipe.title || 'Рецепт'}"
                    />`
                    : `<div class="recipe-card__placeholder">Нет изображения</div>`
                }
            </figure>
            <footer class="recipe-card__footer">
                <button class="btn btn--primary" data-id="${recipe.id}" >Приготовить</button>
                <button class="btn btn--danger" data-id="${recipe.id}">Удалить</button>
            </footer>
        `;

        card.querySelector('.recipe-card__footer .btn--primary').addEventListener('click', () => {
            this.dialog.showModal();
            this.renderRecipe(recipe.id);
        });

        card.querySelector('.recipe-card__footer .btn--danger').addEventListener('click', () => {
            this.recipeManager.deleteRecipe(recipe.id);
            this.renderRecipes();
        });

        return card;
    }

    renderRecipe(id) {
        const recipe = this.recipeManager.findRecipe(id);

        this.dialog.innerHTML = `
            <header class="recipe-dialog__header">
                <h3 class="recipe-dialog__title">${recipe.title}</h3>
                <div class="recipe-dialog__meta">
                    <span class=" badge recipe-dialog__category">${recipe.category}</span>
                    <time
                      class="recipe-dialog__date"
                      datetime="${new Date().toISOString().split('T')[0]}"
                    >
                      ${recipe.createdAt}
                    </time>
                </div>
            </header>
            <section class="recipe-dialog__body">
              <div class="recipe-dialog__section">
                <h4>Ингредиенты</h4>
                <ul>
                  ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
              </div>
        
              <div class="recipe-dialog__section">
                <h4>Этапы приготовления</h4>
                <ol>
                  ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
              </div>
            </section>
            <footer class="recipe-dialog__footer">
              <button
                type="button"
                class="btn btn--primary"
                data-id="${recipe.id}"
              >
                Готово
              </button>
            </footer>
        `;

        this.dialog.querySelector('.recipe-dialog__footer .btn')
            .addEventListener('click', () => {
                this.dialog.close();
            })
    }

    renderRecipes() {
        this.recipeCards.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.recipesPerPage;
        const endIndex = startIndex + this.recipesPerPage;
        const paginatedRecipes = this.recipeManager.recipes.slice(startIndex, endIndex);

        paginatedRecipes.forEach(recipe => {
            this.recipeCards.appendChild(this.createRecipeCard(recipe));
        });

        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.recipeManager.recipes.length / this.recipesPerPage);

        if (totalPages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }

        this.paginationContainer.innerHTML = `
          <div class="pagination">
            <button class="btn btn--primary" ${this.currentPage === 1 ? 'disabled' : ''} data-page="prev">
              Назад
            </button>
            <span>Страница ${this.currentPage} из ${totalPages}</span>
            <button class="btn btn--primary" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="next">
              Вперёд
            </button>
          </div>
        `;

        this.paginationContainer.querySelectorAll('.pagination .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetPage = e.target.dataset.page;
                if (targetPage === 'prev' && this.currentPage > 1) {
                    this.currentPage--;
                } else if (targetPage === 'next' && this.currentPage < totalPages) {
                    this.currentPage++;
                }
                this.renderRecipes();
            });
        });
    }

    resetForm() {
        this.form.reset();
        this.ingredientsFM.fieldset.querySelectorAll('.ingredient-item').forEach(el => el.remove());
        this.stepsFM.fieldset.querySelectorAll('.step-item').forEach(el => el.remove());
        this.ingredientsFM.addItem();
        this.stepsFM.addItem();
    }
}
