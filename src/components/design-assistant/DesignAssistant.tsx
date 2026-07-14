'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { Sparkles, X, Palette, Sliders, Type, Send, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DesignAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignAssistant: React.FC<DesignAssistantProps> = ({ isOpen, onClose }) => {
  const { designConfig, updateDesignConfig, settings, updateSettings } = useAppState();
  const [promptInput, setPromptInput] = useState('');
  const [promptFeedback, setPromptFeedback] = useState<string | null>(null);

  const presets = {
    primary: [
      { name: 'Indigo (Default)', hex: '#4F46E5' },
      { name: 'Purple', hex: '#7C3AED' },
      { name: 'Emerald', hex: '#10B981' },
      { name: 'Rose', hex: '#F43F5E' },
      { name: 'Sky Blue', hex: '#0EA5E9' },
      { name: 'Amber Gold', hex: '#F59E0B' }
    ],
    secondary: [
      { name: 'Violet (Default)', hex: '#7C3AED' },
      { name: 'Fuchsia', hex: '#D946EF' },
      { name: 'Teal', hex: '#14B8A6' },
      { name: 'Orange', hex: '#F97316' },
      { name: 'Indigo', hex: '#4F46E5' }
    ],
    fonts: ['Poppins', 'Inter', 'system-ui', 'monospace']
  };

  // Natural Language Prompt Parser
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    const query = promptInput.toLowerCase();
    const updates: any = {};
    const feedbackParts: string[] = [];

    // Parse color adjustments
    if (query.includes('green') || query.includes('emerald') || query.includes('mint')) {
      updates.accentColor = '#10B981';
      updates.secondaryColor = '#059669';
      feedbackParts.push('Accent updated to Emerald Green');
    } else if (query.includes('red') || query.includes('rose') || query.includes('crimson')) {
      updates.accentColor = '#F43F5E';
      updates.secondaryColor = '#E11D48';
      feedbackParts.push('Accent updated to Rose Red');
    } else if (query.includes('orange') || query.includes('amber') || query.includes('sunset')) {
      updates.accentColor = '#F97316';
      updates.secondaryColor = '#F59E0B';
      feedbackParts.push('Accent updated to Sunset Orange');
    } else if (query.includes('blue') || query.includes('sky') || query.includes('ocean')) {
      updates.accentColor = '#0EA5E9';
      updates.secondaryColor = '#2563EB';
      feedbackParts.push('Accent updated to Ocean Blue');
    } else if (query.includes('purple') || query.includes('fuchsia') || query.includes('cyber')) {
      updates.accentColor = '#A855F7';
      updates.secondaryColor = '#E2E8F0';
      feedbackParts.push('Accent updated to Cyber Purple');
    } else if (query.includes('indigo') || query.includes('classic')) {
      updates.accentColor = '#4F46E5';
      updates.secondaryColor = '#7C3AED';
      feedbackParts.push('Accent reverted to Indigo/Purple');
    }

    // Parse Corner Rounding
    if (query.includes('rounded') || query.includes('bubble') || query.includes('soft') || query.includes('curved')) {
      if (query.includes('extremely') || query.includes('extra') || query.includes('very')) {
        updates.radius = 28;
        feedbackParts.push('Card corners set to extra rounded (28px)');
      } else {
        updates.radius = 20;
        feedbackParts.push('Card corners set to rounded (20px)');
      }
    } else if (query.includes('sharp') || query.includes('square') || query.includes('flat')) {
      updates.radius = 4;
      feedbackParts.push('Card corners set to sharp (4px)');
    }

    // Parse Glass opacity & blur
    if (query.includes('glassy') || query.includes('transparent') || query.includes('translucent') || query.includes('crystal')) {
      updates.glassOpacity = 0.35;
      updates.blur = 20;
      feedbackParts.push('Increased transparency & glass blur strength');
    } else if (query.includes('solid') || query.includes('opaque') || query.includes('clean')) {
      updates.glassOpacity = 0.95;
      updates.blur = 4;
      feedbackParts.push('Set containers to solid opaque style');
    }

    // Parse Dark/Light Mode
    if (query.includes('dark') || query.includes('night') || query.includes('midnight')) {
      updateSettings({ ...settings, theme: 'dark' });
      document.documentElement.classList.add('dark');
      feedbackParts.push('Theme set to Dark Mode');
    } else if (query.includes('light') || query.includes('day') || query.includes('white')) {
      updateSettings({ ...settings, theme: 'light' });
      document.documentElement.classList.remove('dark');
      feedbackParts.push('Theme set to Light Mode');
    }

    // Parse Typography font
    if (query.includes('mono') || query.includes('coding')) {
      updates.fontFamily = 'monospace';
      feedbackParts.push('Font family set to Monospace');
    } else if (query.includes('clean') || query.includes('modern') || query.includes('sans')) {
      updates.fontFamily = 'Poppins';
      feedbackParts.push('Font family set to Poppins sans-serif');
    }

    if (Object.keys(updates).length > 0) {
      updateDesignConfig(updates);
      setPromptFeedback(`AI Applied: ${feedbackParts.join(', ')}`);
    } else {
      setPromptFeedback("AI design assistant couldn't match a style pattern. Try saying: 'make it glassy emerald green with soft round corners'");
    }

    setPromptInput('');
    setTimeout(() => setPromptFeedback(null), 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-30"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 md:w-96 bg-[var(--sidebar-bg)] border-l border-[var(--card-border)] backdrop-blur-2xl z-40 flex flex-col justify-between overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--card-border)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600 animate-pulse" />
                <h2 className="font-bold text-base text-zinc-800 dark:text-zinc-100">AI Design Assistant</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customizer Settings */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Natural Language Prompt Input */}
              <div className="bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 rounded-xl border border-violet-500/15 p-4 space-y-3">
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Style Prompt</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Describe what theme modifications you want in plain English (e.g. "make it sunset orange and glassy with curved corners")
                </p>
                <form onSubmit={handlePromptSubmit} className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Enter visual design prompt..."
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl bg-white dark:bg-[#0f172a] border border-[var(--card-border)] focus:outline-none focus:border-violet-500 text-zinc-800 dark:text-zinc-200"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-2.5 text-violet-500 hover:text-violet-600 p-0.5 rounded-md hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                
                {promptFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] p-2 bg-violet-500/10 text-violet-600 dark:text-violet-300 rounded-lg flex items-center gap-1.5 border border-violet-500/10"
                  >
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>{promptFeedback}</span>
                  </motion.div>
                )}
              </div>

              {/* Color Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <Palette className="w-4.5 h-4.5" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Accent Theme Colors</h3>
                </div>
                
                {/* Primary Picker */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500">Primary Color</label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {presets.primary.map(p => (
                      <button
                        key={p.hex}
                        onClick={() => updateDesignConfig({ accentColor: p.hex })}
                        className={`h-7 rounded-lg transition-transform border border-black/10 dark:border-white/10 ${designConfig.accentColor === p.hex ? 'scale-110 ring-2 ring-violet-500' : 'hover:scale-105'}`}
                        style={{ backgroundColor: p.hex }}
                        title={p.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Secondary Picker */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500">Secondary Color</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {presets.secondary.map(s => (
                      <button
                        key={s.hex}
                        onClick={() => updateDesignConfig({ secondaryColor: s.hex })}
                        className={`h-7 rounded-lg transition-transform border border-black/10 dark:border-white/10 ${designConfig.secondaryColor === s.hex ? 'scale-110 ring-2 ring-violet-500' : 'hover:scale-105'}`}
                        style={{ backgroundColor: s.hex }}
                        title={s.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <Sliders className="w-4.5 h-4.5" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Glassmorphic Sliders</h3>
                </div>

                {/* Roundness */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                    <span>Card Corner Radius</span>
                    <span>{designConfig.radius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={designConfig.radius}
                    onChange={(e) => updateDesignConfig({ radius: parseInt(e.target.value) })}
                    className="w-full accent-violet-600 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>

                {/* Blur strength */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                    <span>Backdrop Blur Filter</span>
                    <span>{designConfig.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={designConfig.blur}
                    onChange={(e) => updateDesignConfig({ blur: parseInt(e.target.value) })}
                    className="w-full accent-violet-600 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>

                {/* Glass Opacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                    <span>Card Glass Opacity</span>
                    <span>{Math.round(designConfig.glassOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="95"
                    value={designConfig.glassOpacity * 100}
                    onChange={(e) => updateDesignConfig({ glassOpacity: parseFloat(e.target.value) / 100 })}
                    className="w-full accent-violet-600 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <Type className="w-4.5 h-4.5" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Typography Fonts</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {presets.fonts.map(font => (
                    <button
                      key={font}
                      onClick={() => updateDesignConfig({ fontFamily: font })}
                      className={`py-2 px-3 text-xs rounded-xl border text-center transition-all ${designConfig.fontFamily === font ? 'bg-violet-600/10 text-violet-600 border-violet-500 font-bold' : 'bg-black/5 dark:bg-white/5 border-[var(--card-border)] hover:bg-black/10 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400'}`}
                      style={{ fontFamily: font }}
                    >
                      {font === 'system-ui' ? 'System UI' : font === 'monospace' ? 'Monospace' : font}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Summary */}
            <div className="p-5 border-t border-[var(--card-border)] bg-black/5 dark:bg-white/5">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                <span>Theme Status</span>
                <span className="uppercase text-violet-600 font-bold">Config Synced</span>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
