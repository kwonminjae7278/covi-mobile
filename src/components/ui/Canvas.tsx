import React from 'react';

interface CanvasProps {
    imageUrl: string | null;
    isLoading: boolean;
}

export const Canvas = ({ imageUrl, isLoading }: CanvasProps) => {
    return (
        <div className="w-full aspect-square rounded-3xl checkered shadow-inner flex items-center justify-center relative overflow-hidden group">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Generated result"
                    className="w-full h-full object-cover block"
                    onError={(e) => {
                        console.error('Canvas Image Load Error. URL:', imageUrl);
                        console.error('Original Error Event:', e);
                    }}
                />
            ) : (
                <div className="text-slate-300 pointer-events-none">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Creating...</span>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};
