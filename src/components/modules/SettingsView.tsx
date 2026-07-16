'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/StateContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Settings, Building2, Image, Mail, Phone, 
  MapPin, Sliders, Volume2, Save, FileSpreadsheet, RefreshCw 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, logActivity, addNotification } = useAppState();

  const [formFields, setFormFields] = useState({
    schoolName: settings.schoolName,
    schoolLogo: settings.schoolLogo,
    address: settings.address,
    email: settings.email,
    phone: settings.phone,
    theme: settings.theme,
    language: settings.language,
    notificationsEnabled: settings.notificationsEnabled
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleAutoSave = (updatedFields: Partial<typeof formFields>) => {
    const nextFields = { ...formFields, ...updatedFields };
    setFormFields(nextFields);
    setSaveStatus('saving');

    try {
      updateSettings({
        schoolName: nextFields.schoolName,
        schoolLogo: nextFields.schoolLogo,
        address: nextFields.address,
        email: nextFields.email,
        phone: nextFields.phone,
        theme: nextFields.theme as 'light' | 'dark',
        language: nextFields.language,
        notificationsEnabled: nextFields.notificationsEnabled
      });

      // Apply theme
      if (updatedFields.hasOwnProperty('theme')) {
        const root = document.documentElement;
        if (updatedFields.theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (err) {
      console.error('Settings auto-save error:', err);
      setSaveStatus('idle');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">System Configurations</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Customize school details, branding assets and system configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Settings Form */}
        <div className="lg:col-span-2">
          <GlassCard hoverEffect={false} className="p-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              
              {/* Branding Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                  <Building2 className="w-4.5 h-4.5 text-brand-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Campus Branding</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* School Name */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-500">School / College Name *</label>
                    <input
                      type="text"
                      required
                      value={formFields.schoolName || ''}
                      onChange={(e) => setFormFields({ ...formFields, schoolName: e.target.value })}
                      onBlur={(e) => handleAutoSave({ schoolName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>

                  {/* Logo URL */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-500">School Logo URL</label>
                    <input
                      type="text"
                      value={formFields.schoolLogo || ''}
                      onChange={(e) => setFormFields({ ...formFields, schoolLogo: e.target.value })}
                      onBlur={(e) => handleAutoSave({ schoolLogo: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                  <Mail className="w-4.5 h-4.5 text-brand-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Contact Directories</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Official Email</label>
                    <input
                      type="email"
                      value={formFields.email || ''}
                      onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                      onBlur={(e) => handleAutoSave({ email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Official Phone</label>
                    <input
                      type="text"
                      value={formFields.phone || ''}
                      onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                      onBlur={(e) => handleAutoSave({ phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-500">Official Address</label>
                    <textarea
                      value={formFields.address || ''}
                      onChange={(e) => setFormFields({ ...formFields, address: e.target.value })}
                      onBlur={(e) => handleAutoSave({ address: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-800 dark:text-zinc-200 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                  <Sliders className="w-4.5 h-4.5 text-brand-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">System Preferences</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Theme */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Default Theme Mode</label>
                    <select
                      value={formFields.theme}
                      onChange={(e) => {
                        const val = e.target.value as 'light' | 'dark';
                        setFormFields({ ...formFields, theme: val });
                        handleAutoSave({ theme: val });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-700 dark:text-zinc-300 focus:outline-none"
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">System Language</label>
                    <select
                      value={formFields.language}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormFields({ ...formFields, language: val });
                        handleAutoSave({ language: val });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--card-border)] text-zinc-700 dark:text-zinc-300 focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="French">French (Français)</option>
                    </select>
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      id="notif"
                      checked={formFields.notificationsEnabled}
                      onChange={() => {
                        const val = !formFields.notificationsEnabled;
                        setFormFields({ ...formFields, notificationsEnabled: val });
                        handleAutoSave({ notificationsEnabled: val });
                      }}
                      className="w-4 h-4 text-brand-primary bg-black/5 border-[var(--card-border)] rounded focus:ring-brand-primary/30 accent-brand-primary"
                    />
                    <label htmlFor="notif" className="ml-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 select-none">
                      Enable Desktop Push notifications & alert logs
                    </label>
                  </div>
                </div>
              </div>

              {/* Auto-Save Status Bar */}
              <div className="flex justify-between items-center border-t border-[var(--card-border)] pt-4 mt-2">
                <div className="text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-300">
                  {saveStatus === 'saving' && (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-zinc-500 dark:text-zinc-400">Saving configurations...</span>
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Configurations auto-saved</span>
                    </>
                  )}
                  {saveStatus === 'idle' && (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                      <span className="text-zinc-400">System settings auto-saved in real-time</span>
                    </>
                  )}
                </div>
              </div>

            </form>
          </GlassCard>
        </div>

        {/* Side Panel for Quick Backups & Restore shortcuts */}
        <div className="space-y-6">
          
          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
              <Building2 className="w-4.5 h-4.5 text-brand-primary" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Logo Preview</h4>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-black/5 dark:bg-white/5 border border-[var(--card-border)] rounded-xl h-40">
              <img
                src={formFields.schoolLogo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150'}
                alt="School logo preview"
                className="max-h-24 max-w-full object-contain rounded-lg"
              />
              <span className="text-[10px] text-zinc-500 font-bold uppercase mt-3">Active school emblem</span>
            </div>
          </GlassCard>

          <GlassCard hoverEffect={false} className="p-5 space-y-4">
            <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">Local Cache Data</h4>
            <p className="text-[10px] text-zinc-500 leading-normal">
              Manage cached memory states and local system storage. Restore original database registers.
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (confirm('Revert all settings and custom entries to original seeds?')) {
                    window.location.reload();
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Revert System Cache
              </button>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
