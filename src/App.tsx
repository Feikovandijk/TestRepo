import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { recipes } from './data/recipes';
import { AppState, DietaryCategory, Recipe, ShoppingListItem, IngredientWithAmount } from './types';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import DietaryFilter from './components/DietaryFilter';
import ShoppingList from './components/ShoppingList';
import SharedList from './pages/SharedList';

function MainApp() {
  const [state, setState] = useState<AppState>({
    availableIngredients: [],
    selectedCategories: [],
    favorites: [],
    shoppingList: [],
  });

  const addIngredient = (ingredient: string) => {
    const ingredients = ingredient.split(',').map(i => i.trim().toLowerCase()).filter(i => i.length > 0);
    
    setState((prev) => ({
      ...prev,
      availableIngredients: [
        ...prev.availableIngredients,
        ...ingredients.filter(i => !prev.availableIngredients.includes(i))
      ],
    }));
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setState((prev) => ({
      ...prev,
      availableIngredients: prev.availableIngredients.filter(
        (ing) => ing !== ingredientToRemove
      ),
    }));
  };

  const toggleCategory = (category: DietaryCategory) => {
    setState((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
  };

  const toggleFavorite = (recipeId: number) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(recipeId)
        ? prev.favorites.filter((id) => id !== recipeId)
        : [...prev.favorites, recipeId],
    }));
  };

  const addToShoppingList = (recipe: Recipe, ingredients: IngredientWithAmount[]) => {
    setState((prev) => {
      const existingItem = prev.shoppingList.find((item) => item.recipeId === recipe.id);
      if (existingItem) {
        return {
          ...prev,
          shoppingList: prev.shoppingList.map((item) =>
            item.recipeId === recipe.id
              ? {
                  ...item,
                  ingredients: [...new Set([...item.ingredients, ...ingredients])],
                }
              : item
          ),
        };
      }
      return {
        ...prev,
        shoppingList: [
          ...prev.shoppingList,
          {
            recipeId: recipe.id,
            recipeName: recipe.name,
            ingredients,
          },
        ],
      };
    });
  };

  const removeFromShoppingList = (recipeId: number, ingredient: IngredientWithAmount) => {
    setState((prev) => ({
      ...prev,
      shoppingList: prev.shoppingList
        .map((item) => {
          if (item.recipeId === recipeId) {
            const newIngredients = item.ingredients.filter((ing) => ing.name !== ingredient.name);
            return newIngredients.length ? { ...item, ingredients: newIngredients } : null;
          }
          return item;
        })
        .filter((item): item is ShoppingListItem => item !== null),
    }));
  };

  const filteredRecipes = recipes.filter((recipe) => {
    if (state.selectedCategories.length > 0) {
      return state.selectedCategories.every((category) =>
        recipe.category.includes(category)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Meal Suggestion Tool</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Ingredients</h2>
            <IngredientInput
              onAddIngredient={addIngredient}
              onRemoveIngredient={removeIngredient}
              availableIngredients={state.availableIngredients}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Dietary Preferences</h2>
            <DietaryFilter
              selectedCategories={state.selectedCategories}
              onToggleCategory={toggleCategory}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Recipe Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  availableIngredients={state.availableIngredients}
                  isFavorite={state.favorites.includes(recipe.id)}
                  onToggleFavorite={() => toggleFavorite(recipe.id)}
                  onAddToShoppingList={(ingredients) =>
                    addToShoppingList(recipe, ingredients)
                  }
                />
              ))}
            </div>
          </section>
        </div>

        <ShoppingList
          items={state.shoppingList}
          onRemoveItem={removeFromShoppingList}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/list/:id" element={<SharedList />} />
      </Routes>
    </BrowserRouter>
  );
}