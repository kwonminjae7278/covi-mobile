import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
    onUpload: (file: File) => void;
    previewUrl: string | null;
}

export const UploadButton = ({ onUpload, previewUrl }: UploadButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 mb-8">
            <button
                onClick={handleClick}
                className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm hover:bg-slate-300 transition-colors"
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <Upload className="w-8 h-8 text-slate-400" />
                )}
            </button>
            <span className="text-sm font-semibold text-slate-800">Creator</span>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
        </div>
    );
};
