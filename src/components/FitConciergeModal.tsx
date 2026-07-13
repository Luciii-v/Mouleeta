"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Ruler, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface FitConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
  productTitle?: string;
}

export default function FitConciergeModal({
  isOpen,
  onClose,
  onSelectSize,
  productTitle = "Mouleeta Creation"
}: FitConciergeModalProps) {
  const [activeTab, setActiveTab] = useState<'calculator' | 'chart'>('calculator');
  const [unit, setUnit] = useState<'cm' | 'in'>('in');

  // Calculator inputs
  const [bust, setBust] = useState<number>(34);
  const [waist, setWaist] = useState<number>(27);
  const [hip, setHip] = useState<number>(37);
  const [height, setHeight] = useState<number>(65); // inches
  const [fitPreference, setFitPreference] = useState<'tailored' | 'relaxed' | 'oversized'>('relaxed');

  // Calculate recommended size
  const calculateSize = (): { size: string; confidence: number; note: string } => {
    // Basic sizing algorithm based on bust/waist in inches
    let baseSize = "M";
    let note = "Perfect tailored drape across waist and bust.";
    let confidence = 96;

    if (bust <= 32 || waist <= 25 || hip <= 35) {
      baseSize = "XS";
      note = height < 63 ? "Recommended for a petite, sculpted silhouette." : "Sculpted silhouette tailored for your height.";
      confidence = 98;
    } else if (bust <= 34 || waist <= 27 || hip <= 37) {
      baseSize = "S";
      note = height < 63 ? "Flattering fluid fit with ease around the hips." : "Flattering length and fluid fall.";
      confidence = 97;
    } else if (bust <= 37 || waist <= 30 || hip <= 39) {
      baseSize = "M";
      note = "Ideal balance of comfort and luxury drape.";
      confidence = 95;
    } else if (bust <= 40 || waist <= 33 || hip <= 41) {
      baseSize = "L";
      note = "Relaxed fall designed for effortless movement.";
      confidence = 94;
    } else {
      baseSize = "XL";
      note = "Generous, sweeping editorial proportion.";
      confidence = 92;
    }

    if (fitPreference === 'oversized' && baseSize !== 'XL') {
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const idx = sizes.indexOf(baseSize);
      if (idx !== -1 && idx < sizes.length - 1) baseSize = sizes[idx + 1];
      note = "Adjusted one size up for an elevated, voluminous evening drape.";
    } else if (fitPreference === 'tailored' && baseSize !== 'XS') {
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const idx = sizes.indexOf(baseSize);
      if (idx > 0) baseSize = sizes[idx - 1];
      note = "Adjusted for a closer, body-skimming atelier fit.";
    }

    return { size: baseSize, confidence, note };
  };

  const recommendation = calculateSize();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl bg-[#FAF9F6] border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 bg-white border-b border-stone-200 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-stone-400 mb-1">
                  <Sparkles size={14} className="text-amber-700" />
                  <span className="font-metropolis text-[9px] tracking-[0.25em] uppercase font-semibold">
                    Atelier Fit Concierge
                  </span>
                </div>
                <h2 className="font-jost font-light text-xl md:text-2xl tracking-[0.18em] uppercase text-stone-900">
                  {productTitle}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-2xl font-light text-stone-400 hover:text-black transition-colors cursor-pointer w-8 h-8 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-100/60">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex-1 py-4 font-metropolis text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'calculator'
                    ? 'border-black bg-[#FAF9F6] text-stone-900 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <Sparkles size={13} /> Find My Atelier Size
              </button>
              <button
                onClick={() => setActiveTab('chart')}
                className={`flex-1 py-4 font-metropolis text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'chart'
                    ? 'border-black bg-[#FAF9F6] text-stone-900 font-semibold'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                <Ruler size={13} /> Measurement Chart
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
              
              {activeTab === 'calculator' ? (
                <div className="space-y-8">
                  
                  {/* Recommended Banner */}
                  <div className="bg-stone-900 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border-l-4 border-amber-600">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-stone-400 text-[10px] uppercase tracking-widest font-metropolis">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>Recommended Fit • {recommendation.confidence}% Match</span>
                      </div>
                      <div className="font-jost text-3xl font-light tracking-widest uppercase">
                        Size {recommendation.size}
                      </div>
                      <p className="text-stone-300 font-inter text-xs max-w-sm">
                        {recommendation.note}
                      </p>
                    </div>

                    {onSelectSize && (
                      <button
                        onClick={() => {
                          onSelectSize(recommendation.size);
                          onClose();
                        }}
                        className="bg-white text-stone-900 hover:bg-stone-200 font-metropolis text-[10px] uppercase tracking-[0.2em] px-6 py-4 transition-colors font-semibold flex items-center gap-2 cursor-pointer flex-shrink-0"
                      >
                        Select Size {recommendation.size} <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  {/* Measurement Sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2 bg-white p-5 border border-onyx/5">
                      <div className="flex justify-between items-center text-xs font-metropolis uppercase tracking-widest text-stone-600">
                        <span>Bust / Chest</span>
                        <span className="font-bold text-stone-900">{bust}&quot; ({Math.round(bust * 2.54)} cm)</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="46"
                        step="1"
                        value={bust}
                        onChange={(e) => setBust(Number(e.target.value))}
                        className="w-full accent-stone-900 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400 font-inter">
                        <span>30&quot; (Petite)</span>
                        <span>46&quot; (Curve)</span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-white p-5 border border-onyx/5">
                      <div className="flex justify-between items-center text-xs font-metropolis uppercase tracking-widest text-stone-600">
                        <span>Waist</span>
                        <span className="font-bold text-stone-900">{waist}&quot; ({Math.round(waist * 2.54)} cm)</span>
                      </div>
                      <input
                        type="range"
                        min="22"
                        max="40"
                        step="1"
                        value={waist}
                        onChange={(e) => setWaist(Number(e.target.value))}
                        className="w-full accent-stone-900 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400 font-inter">
                        <span>22&quot;</span>
                        <span>40&quot;</span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-white p-5 border border-onyx/5">
                      <div className="flex justify-between items-center text-xs font-metropolis uppercase tracking-widest text-stone-600">
                        <span>Hip / Pelvis</span>
                        <span className="font-bold text-stone-900">{hip}&quot; ({Math.round(hip * 2.54)} cm)</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="50"
                        step="1"
                        value={hip}
                        onChange={(e) => setHip(Number(e.target.value))}
                        className="w-full accent-stone-900 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400 font-inter">
                        <span>30&quot;</span>
                        <span>50&quot;</span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-white p-5 border border-onyx/5">
                      <div className="flex justify-between items-center text-xs font-metropolis uppercase tracking-widest text-stone-600">
                        <span>Height</span>
                        <span className="font-bold text-stone-900">{Math.floor(height / 12)}&apos;{height % 12}&quot; ({Math.round(height * 2.54)} cm)</span>
                      </div>
                      <input
                        type="range"
                        min="58"
                        max="76"
                        step="1"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full accent-stone-900 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400 font-inter">
                        <span>4&apos;10&quot; (58&quot;)</span>
                        <span>6&apos;4&quot; (76&quot;)</span>
                      </div>
                    </div>
                  </div>

                  {/* Silhouette Preference */}
                  <div className="space-y-3">
                    <span className="font-metropolis text-[10px] tracking-[0.2em] uppercase text-stone-400 block">
                      How do you prefer your evening silhouettes to drape?
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'tailored', label: 'Tailored Fit', sub: 'Closer silhouette' },
                        { id: 'relaxed', label: 'Relaxed Drape', sub: 'Atelier default' },
                        { id: 'oversized', label: 'Voluminous', sub: 'Sweeping ease' }
                      ].map((pref) => (
                        <button
                          key={pref.id}
                          onClick={() => setFitPreference(pref.id as 'tailored' | 'relaxed' | 'oversized')}
                          className={`p-4 border text-left transition-all duration-200 cursor-pointer ${
                            fitPreference === pref.id
                              ? 'border-stone-900 bg-white shadow-sm'
                              : 'border-stone-200 bg-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <span className="font-jost text-xs uppercase tracking-widest block font-medium text-stone-900">
                            {pref.label}
                          </span>
                          <span className="font-inter text-[10px] text-stone-400 block mt-0.5">
                            {pref.sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guarantee Note */}
                  <div className="p-4 bg-amber-50/50 border border-amber-200/60 flex items-center gap-3 text-stone-700">
                    <ShieldCheck size={20} className="text-amber-700 flex-shrink-0" />
                    <p className="font-inter text-xs leading-relaxed">
                      <strong>Mouleeta Privé Assurance:</strong> Every piece includes complimentary custom tailoring alterations and white-glove returns if the fit is not absolute perfection.
                    </p>
                  </div>

                </div>
              ) : (
                /* Chart Content */
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-metropolis text-[10px] tracking-[0.2em] uppercase text-stone-400">
                      Standard Garment Measurements
                    </span>
                    <div className="flex border border-stone-300 bg-white">
                      <button
                        onClick={() => setUnit('in')}
                        className={`px-3 py-1 text-[10px] font-metropolis uppercase tracking-widest cursor-pointer ${
                          unit === 'in' ? 'bg-stone-900 text-white font-bold' : 'text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        INCHES
                      </button>
                      <button
                        onClick={() => setUnit('cm')}
                        className={`px-3 py-1 text-[10px] font-metropolis uppercase tracking-widest cursor-pointer ${
                          unit === 'cm' ? 'bg-stone-900 text-white font-bold' : 'text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        CM
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto bg-white border border-onyx/5">
                    <table className="w-full text-left font-inter text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-onyx/10 bg-stone-50 text-stone-500 text-[10px] font-metropolis tracking-widest uppercase">
                          <th className="p-4 font-semibold">Size</th>
                          <th className="p-4 font-semibold">UK / AU</th>
                          <th className="p-4 font-semibold">US</th>
                          <th className="p-4 font-semibold">Bust ({unit})</th>
                          <th className="p-4 font-semibold">Waist ({unit})</th>
                          <th className="p-4 font-semibold">Hip ({unit})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-800">
                        {[
                          { size: 'XS', uk: '6', us: '2', bustIn: '32', waistIn: '25', hipIn: '35' },
                          { size: 'S', uk: '8', us: '4', bustIn: '34', waistIn: '27', hipIn: '37' },
                          { size: 'M', uk: '10', us: '6', bustIn: '36', waistIn: '29', hipIn: '39' },
                          { size: 'L', uk: '12', us: '8', bustIn: '38', waistIn: '31', hipIn: '41' },
                          { size: 'XL', uk: '14', us: '10', bustIn: '40', waistIn: '33', hipIn: '43' },
                          { size: 'XXL', uk: '16', us: '12', bustIn: '42', waistIn: '35', hipIn: '45' }
                        ].map((row) => {
                          const mult = unit === 'cm' ? 2.54 : 1;
                          return (
                            <tr key={row.size} className="hover:bg-stone-50/80 transition-colors">
                              <td className="p-4 font-bold font-jost text-sm">{row.size}</td>
                              <td className="p-4 text-stone-500">{row.uk}</td>
                              <td className="p-4 text-stone-500">{row.us}</td>
                              <td className="p-4">{Math.round(Number(row.bustIn) * mult)}</td>
                              <td className="p-4">{Math.round(Number(row.waistIn) * mult)}</td>
                              <td className="p-4">{Math.round(Number(row.hipIn) * mult)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] font-inter text-stone-400 italic">
                    * Length measurements vary by silhouette. For floor-length georgette and silk dresses, standard length from shoulder to hem is 60&quot; (152 cm).
                  </p>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 bg-stone-100/80 border-t border-stone-200 flex justify-between items-center">
              <span className="font-metropolis text-[9px] tracking-[0.2em] uppercase text-stone-400">
                Need bespoke tailoring? Our craftsmen are at your service.
              </span>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-stone-900 text-white font-metropolis text-[9px] uppercase tracking-[0.2em] hover:bg-black transition-colors cursor-pointer"
              >
                Close Concierge
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
