export type DietaryCategory = 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free';

export interface IngredientWithAmount {
  name: string;
  amount: string;
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: IngredientWithAmount[];
  instructions: string[];
  category: string[];
}

export interface ShoppingListItem {
  recipeId: number;
  recipeName: string;
  ingredients: IngredientWithAmount[];
}

export interface AppState {
  availableIngredients: string[];
  selectedCategories: DietaryCategory[];
  favorites: number[];
  shoppingList: ShoppingListItem[];
}