import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  availableIngredients: string[];
}

export default function IngredientInput({ 
  onAddIngredient, 
  onRemoveIngredient,
  availableIngredients 
}: Props) {
  const [ingredient, setIngredient] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredient.trim()) {
      onAddIngredient(ingredient.toLowerCase().trim());
      setIngredient('');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="Enter an ingredient..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {availableIngredients.map((ing) => (
          <span
            key={ing}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
          >
            {ing}
            <button
              onClick={() => onRemoveIngredient(ing)}
              className="hover:bg-blue-200 rounded-full p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}