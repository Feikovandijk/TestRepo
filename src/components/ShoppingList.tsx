import React, { useState } from 'react';
import { ShoppingBag, X, QrCode } from 'lucide-react';
import { ShoppingListItem } from '../types';
import { createShoppingList } from '../lib/supabase';
import QRModal from './QRModal';

interface Props {
  items: ShoppingListItem[];
  onRemoveItem: (recipeId: number, ingredient: ShoppingListItem['ingredients'][0]) => void;
}

export default function ShoppingList({ items, onRemoveItem }: Props) {
  const [showQR, setShowQR] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');

  const handleShare = async () => {
    try {
      const list = await createShoppingList(items);
      const url = `${window.location.origin}/list/${list.id}`;
      setShareUrl(url);
      setShowQR(true);
    } catch (error) {
      console.error('Error creating shareable list:', error);
      alert('Failed to create shareable list. Please try again.');
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Shopping List</h3>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Share List
            <QrCode className="w-4 h-4" />
          </button>
        </div>

        {items.map((item) => (
          <div key={item.recipeId} className="mb-4">
            <h4 className="font-medium text-sm mb-2">{item.recipeName}</h4>
            <ul className="space-y-2">
              {item.ingredients.map((ing) => (
                <li key={ing.name} className="flex items-center justify-between text-sm">
                  <span>{ing.amount} {ing.name}</span>
                  <button
                    onClick={() => onRemoveItem(item.recipeId, ing)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {showQR && <QRModal url={shareUrl} onClose={() => setShowQR(false)} />}
    </>
  );
}