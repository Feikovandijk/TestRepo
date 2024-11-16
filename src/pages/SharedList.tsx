import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShoppingList } from '../lib/supabase';
import { ShoppingListItem } from '../types';
import { ShoppingBag, Check } from 'lucide-react';

export default function SharedList() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadList() {
      try {
        const data = await getShoppingList(id!);
        setItems(data.items);
      } catch (err) {
        setError('Shopping list not found or has expired');
      } finally {
        setLoading(false);
      }
    }

    loadList();
  }, [id]);

  const toggleItem = (recipeId: number, ingredientName: string) => {
    const key = `${recipeId}-${ingredientName}`;
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-gray-600 mt-2">Please request a new shopping list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Shopping List</h1>
        </div>

        {items.map((item) => (
          <div key={item.recipeId} className="mb-6">
            <h2 className="font-medium text-lg mb-3">{item.recipeName}</h2>
            <ul className="space-y-2">
              {item.ingredients.map((ing) => {
                const itemKey = `${item.recipeId}-${ing.name}`;
                const isChecked = checkedItems.has(itemKey);

                return (
                  <li
                    key={ing.name}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => toggleItem(item.recipeId, ing.name)}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center
                      ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                    >
                      {isChecked && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`flex-1 ${isChecked ? 'line-through text-gray-400' : ''}`}>
                      {ing.amount} {ing.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}