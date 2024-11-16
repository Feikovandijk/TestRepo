import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  availableIngredients: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToShoppingList: (ingredients: Recipe['ingredients']) => void;
}

const ingredientMatches = (available: string, recipeIngredient: string): boolean => {
  const normalizedAvailable = available.toLowerCase();
  const normalizedRecipe = recipeIngredient.toLowerCase();
  
  // Check if it's a plural form
  const singularForm = normalizedAvailable.endsWith('s') 
    ? normalizedAvailable.slice(0, -1) 
    : normalizedAvailable;
  
  return normalizedRecipe.includes(normalizedAvailable) || 
         normalizedRecipe.includes(singularForm);
};

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  availableIngredients,
  isFavorite,
  onToggleFavorite,
  onAddToShoppingList,
}) => {
  const missingIngredients = recipe.ingredients.filter(
    (ing) => !availableIngredients.some(available => 
      ingredientMatches(available, ing.name)
    )
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{recipe.name}</h3>
        <button
          onClick={onToggleFavorite}
          className="text-gray-400 hover:text-yellow-400"
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Ingredients:</h4>
        <ul className="space-y-1">
          {recipe.ingredients.map((ing) => (
            <li
              key={ing.name}
              className={
                availableIngredients.some(available => 
                  ingredientMatches(available, ing.name)
                )
                  ? "text-green-600"
                  : "text-gray-600"
              }
            >
              {ing.amount} {ing.name}
            </li>
          ))}
        </ul>
      </div>

      {missingIngredients.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-red-600 mb-2">Missing ingredients:</p>
          <div className="flex flex-wrap gap-2">
            {missingIngredients.map((ing) => (
              <span
                key={ing.name}
                className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"
              >
                {ing.name} ({ing.amount})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-medium">Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="text-sm">
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      {missingIngredients.length > 0 && (
        <button
          onClick={() => onAddToShoppingList(missingIngredients)}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Add missing ingredients to shopping list
        </button>
      )}
    </div>
  );
};

export default RecipeCard;