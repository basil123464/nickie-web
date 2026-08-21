import React, { useState } from 'react';
import { X, Ruler, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category }) => {
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  if (!isOpen) return null;

  const hoodieMeasurements = [
    { size: 'XS', chest: unit === 'cm' ? '106 cm' : '41.7 in', length: unit === 'cm' ? '68 cm' : '26.8 in', shoulder: unit === 'cm' ? '52 cm' : '20.5 in' },
    { size: 'S', chest: unit === 'cm' ? '112 cm' : '44.1 in', length: unit === 'cm' ? '70 cm' : '27.5 in', shoulder: unit === 'cm' ? '54 cm' : '21.2 in' },
    { size: 'M', chest: unit === 'cm' ? '118 cm' : '46.5 in', length: unit === 'cm' ? '72 cm' : '28.3 in', shoulder: unit === 'cm' ? '56 cm' : '22.0 in' },
    { size: 'L', chest: unit === 'cm' ? '124 cm' : '48.8 in', length: unit === 'cm' ? '74 cm' : '29.1 in', shoulder: unit === 'cm' ? '58 cm' : '22.8 in' },
    { size: 'XL', chest: unit === 'cm' ? '130 cm' : '51.2 in', length: unit === 'cm' ? '76 cm' : '29.9 in', shoulder: unit === 'cm' ? '60 cm' : '23.6 in' },
    { size: 'XXL', chest: unit === 'cm' ? '136 cm' : '53.5 in', length: unit === 'cm' ? '78 cm' : '30.7 in', shoulder: unit === 'cm' ? '62 cm' : '24.4 in' },
  ];

  return (
    <div id="size-guide-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121212] border border-[#222222] rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Streetwear Size Guide</h3>
              <p className="text-xs text-neutral-400">Boxy & Oversized Fit Standards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#181818] border border-transparent hover:border-[#222222] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="my-4 flex items-center justify-between">
          <span className="text-xs text-neutral-400">Select measurement units:</span>
          <div className="flex bg-[#0A0A0A] p-1 rounded-xl border border-[#222222]">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                unit === 'cm' ? 'bg-amber-500 text-black shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Centimeters (cm)
            </button>
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                unit === 'inches' ? 'bg-amber-500 text-black shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Inches (in)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0A0A0A] text-neutral-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Size</th>
                <th className="py-2.5 px-3">Chest Width</th>
                <th className="py-2.5 px-3">Body Length</th>
                <th className="py-2.5 px-3 rounded-r-lg">Shoulder Drop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222] text-neutral-300">
              {hoodieMeasurements.map((m) => (
                <tr key={m.size} className="hover:bg-[#181818] transition">
                  <td className="py-2.5 px-3 font-bold text-amber-400">{m.size}</td>
                  <td className="py-2.5 px-3">{m.chest}</td>
                  <td className="py-2.5 px-3">{m.length}</td>
                  <td className="py-2.5 px-3">{m.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fitting Note */}
        <div className="mt-4 p-3 bg-[#0A0A0A] rounded-xl border border-[#222222] text-xs text-neutral-400 space-y-1">
          <p className="font-semibold text-neutral-200 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            Fit Recommendation:
          </p>
          <p>
            Our hoodies and tees are designed with a contemporary boxy drop-shoulder silhouette. For standard streetwear fit, order your normal size. For a fitted look, consider sizing down.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black py-2.5 rounded-xl font-bold text-xs transition shadow-lg shadow-amber-500/20"
        >
          Got It, Back to Product
        </button>
      </div>
    </div>
  );
};
