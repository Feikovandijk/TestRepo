import React from 'react';
import { DietaryCategory } from '../types';

interface Props {
  selectedCategories: DietaryCategory[];
  onToggleCategory: (category: DietaryCategory) => void;
}

export default function DietaryFilter({ selectedCategories, onToggleCategory }: Props) {
  const categories: DietaryCategory[] = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onToggleCategory(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategories.includes(category)
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}