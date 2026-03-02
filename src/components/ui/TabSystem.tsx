import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Zap, Target } from 'lucide-react';

interface TabSystemProps {
    onSelect: (category: string, value: string) => void;
    selectedValues: Record<string, string>;
}

const EMOJIS = {
    Emotion: ['🙂', '😉', '😍', '😐', '😮', '😵', '😰', '😢', '😡', '🥺', '🤤'],
    Intention: ['👏', '📤', '👆', '📥', '👍', '🙏', '🙅', '👌', '✊'],
    Target: ['🎧', '📖', '📷', '🎁', '💡', '🎤', '🖱️'],
};

export const TabSystem = ({ onSelect, selectedValues }: TabSystemProps) => {
    const [activeTab, setActiveTab] = useState<'Emotion' | 'Intention' | 'Target'>('Emotion');

    const tabs = [
        { id: 'Emotion', icon: Smile, label: 'Emotion' },
        { id: 'Intention', icon: Zap, label: 'Intention' },
        { id: 'Target', icon: Target, label: 'Target' },
    ] as const;

    return (
        <div className="mt-8 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors relative ${activeTab === tab.id ? 'text-white' : 'text-slate-300'
                            }`}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-brand-blue"
                            />
                        )}
                        <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? 'text-white' : ''}`} />
                        <span className="text-xs font-bold relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Emoji Grid */}
            <div className="p-4 py-6 min-h-[200px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-5 gap-3 justify-items-center"
                    >
                        {EMOJIS[activeTab].map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => onSelect(activeTab, emoji)}
                                className={`w-full aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all active:scale-90 ${selectedValues[activeTab] === emoji
                                    ? 'bg-brand-blue/10 border-2 border-brand-blue'
                                    : 'bg-slate-50 border border-slate-100 grayscale opacity-50 hover:grayscale-0 hover:opacity-100'
                                    }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
