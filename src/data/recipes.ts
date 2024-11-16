import recipesData from './recipes.json';
import { Recipe } from '../types';

// Type assertion to ensure the JSON data matches our Recipe type
export const recipes: Recipe[] = recipesData.recipes as Recipe[];