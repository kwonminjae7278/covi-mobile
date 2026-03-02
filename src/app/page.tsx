'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { UploadButton } from '@/components/ui/UploadButton';
import { Canvas } from '@/components/ui/Canvas';
import { TabSystem } from '@/components/ui/TabSystem';
import { Smile, Zap, Target as TargetIcon } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selections, setSelections] = useState({
    Emotion: '',
    Intention: '',
    Target: '',
  });

  const handleUpload = (file: File) => {
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSelect = (category: string, value: string) => {
    setSelections(prev => ({ ...prev, [category]: value }));
  };

  const handleGenerate = async () => {
    if (!file) return;
    setIsLoading(true);
    setGeneratedImageUrl(null);

    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };

    try {
      // 1. Convert file to Base64
      const base64Image = await fileToBase64(file);

      // 2. Call our internal generation API with Base64
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: base64Image,
          emotion: selections.Emotion,
          intention: selections.Intention,
          target: selections.Target,
        }),
      });

      const data = await response.json();
      console.log('Backend Response Data:', data);

      // Explicitly extract image URL from confirmed response structure
      // Note: User confirmed it's nested as { data: { images: [...] } }
      let url = null;

      // 1. Try nested data.data approach (based on user feedback)
      if (data.data?.images && Array.isArray(data.data.images) && data.data.images.length > 0) {
        url = data.data.images[0].url;
        console.log('Extracted URL from data.data.images[0].url:', url);
      }
      // 2. Try direct data.images approach (standard behavior)
      else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        url = data.images[0].url;
        console.log('Extracted URL from data.images[0].url:', url);
      }
      // 3. Failover types
      else if (data.image?.url) {
        url = data.image.url;
      } else if (typeof data.image === 'string') {
        url = data.image;
      } else if (data.data?.image?.url) {
        url = data.data.image.url;
      }

      if (url) {
        setGeneratedImageUrl(url);
        console.log('State updated with generatedImageUrl:', url);
      } else if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        console.warn('Could not find image URL in response structure:', data);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-svh bg-white w-full max-w-[430px] mx-auto flex flex-col p-0 sm:p-4 overflow-hidden">
      <div className="px-4 pt-4">
        <Header />
      </div>

      <div className="flex-1 flex flex-col items-center px-4 overflow-y-auto">
        <UploadButton onUpload={handleUpload} previewUrl={previewUrl} />

        <div className="w-full mt-4">
          <Canvas imageUrl={generatedImageUrl} isLoading={isLoading} />
        </div>

        {/* Action Controls */}
        <div className="w-full flex items-center justify-between gap-3 mt-8">
          <button className="flex-1 px-6 py-3 bg-white border border-slate-200 rounded-xl text-base font-bold shadow-sm active:bg-slate-50 transition-colors">
            Back
          </button>

          <div className="flex items-center gap-2">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 ${selections.Emotion ? 'bg-slate-100' : 'bg-white'}`}>
              <Smile className={`w-7 h-7 ${selections.Emotion ? 'text-brand-blue' : 'text-slate-300'}`} />
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 ${selections.Intention ? 'bg-slate-100' : 'bg-white'}`}>
              <Zap className={`w-7 h-7 ${selections.Intention ? 'text-brand-blue' : 'text-slate-300'}`} />
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 ${selections.Target ? 'bg-slate-100' : 'bg-white'}`}>
              <TargetIcon className={`w-7 h-7 ${selections.Target ? 'text-brand-blue' : 'text-slate-300'}`} />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!file || isLoading}
            className={`flex-1 px-6 py-3 border rounded-xl text-base font-bold shadow-sm transition-all active:scale-95 ${file && !isLoading
              ? 'bg-brand-blue text-white border-brand-blue'
              : 'bg-slate-50 border-slate-100 text-slate-300 pointer-events-none'
              }`}
          >
            {isLoading ? '...' : 'Done'}
          </button>
        </div>

        <div className="w-full pb-8">
          <TabSystem onSelect={handleSelect} selectedValues={selections} />
        </div>
      </div>
    </main>
  );
}
