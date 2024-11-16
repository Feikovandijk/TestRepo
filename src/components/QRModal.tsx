import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Share2 } from 'lucide-react';

interface Props {
  url: string;
  onClose: () => void;
}

export default function QRModal({ url, onClose }: Props) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Share Shopping List</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <QRCodeSVG value={url} size={200} />
          
          <div className="w-full">
            <p className="text-sm text-gray-600 mb-2">Or share this link:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            This shopping list will be available for 48 hours
          </p>
        </div>
      </div>
    </div>
  );
}