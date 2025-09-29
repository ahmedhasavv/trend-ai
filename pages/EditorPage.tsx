import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TRENDS } from '../constants';
import { Trend, GeneratedImage } from '../types';
import ImageUploader from '../components/ImageUploader';
import { generateImageVariations } from '../services/geminiService';
import Loader from '../components/Loader';
import useLocalStorage from '../hooks/useLocalStorage';
import { DownloadIcon, ShareIcon, SparklesIcon, PlusCircleIcon } from '../components/icons';

const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [mimeType, base64Data] = result.split(',', 2);
      resolve({ base64: base64Data, mimeType: mimeType.split(':')[1].split(';')[0] });
    };
    reader.onerror = error => reject(error);
  });
};


const EditorPage: React.FC = () => {
  const { trendId } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useLocalStorage<GeneratedImage[]>('trendai-gallery', []);
  
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trendId) {
      const trend = TRENDS.find(t => t.id === trendId);
      setSelectedTrend(trend || null);
    } else if (TRENDS.length > 0) {
        setSelectedTrend(TRENDS[0]);
    }
  }, [trendId]);

  const handleImageSelect = useCallback((file: File) => {
    setUserImage(file);
    setGeneratedImageUrls([]);
    setSelectedImageUrl(null);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
  }, []);
  
  const clearImage = useCallback(() => {
      if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
      }
      setUserImage(null);
      setImagePreviewUrl(null);
      setGeneratedImageUrls([]);
      setSelectedImageUrl(null);
  }, [imagePreviewUrl]);

  const handleGenerate = async () => {
    if (!selectedTrend || !userImage) {
      setError("Please select a trend and upload an image.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrls([]);
    setSelectedImageUrl(null);
    
    try {
        const { base64, mimeType } = await fileToBase64(userImage);
        const generatedBase64Array = await generateImageVariations(base64, mimeType, selectedTrend.prompt);
        
        const fullImageUrls = generatedBase64Array.map(genBase64 => `data:image/png;base64,${genBase64}`);
        setGeneratedImageUrls(fullImageUrls);
        if (fullImageUrls.length > 0) {
            setSelectedImageUrl(fullImageUrls[0]);
        }
        
    } catch (err: any) {
        setError(err.message || "An unknown error occurred during image generation.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!selectedImageUrl || !selectedTrend || !userImage) return;

    const { base64: sourceBase64, mimeType } = await fileToBase64(userImage);

    const newGalleryItem: GeneratedImage = {
        id: `trendai-${Date.now()}`,
        sourceImage: `data:${mimeType};base64,${sourceBase64}`,
        generatedImage: selectedImageUrl,
        trendId: selectedTrend.id,
        prompt: selectedTrend.prompt,
        timestamp: Date.now()
    };
    setGallery([newGalleryItem, ...gallery]);
    alert("Saved to gallery!");
  };

  const handleDownload = () => {
    if (!selectedImageUrl) return;
    const link = document.createElement('a');
    link.href = selectedImageUrl;
    link.download = `${selectedTrend?.id || 'trend'}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleShare = async () => {
    if (!selectedImageUrl) return;
    try {
        const response = await fetch(selectedImageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${selectedTrend?.id || 'trend'}.png`, { type: 'image/png' });

        if (navigator.share) {
            await navigator.share({
                title: 'Made with TrendAI',
                text: `Check out this image I created with the "${selectedTrend?.name}" trend on TrendAI!`,
                files: [file],
            });
        } else {
            alert('Share API not supported on this browser. Try downloading the image instead.');
        }
    } catch (err) {
        console.error('Error sharing:', err);
        alert('Could not share the image.');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Controls */}
        <div className="flex flex-col space-y-6">
          <div>
            <label htmlFor="trend-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1. Choose a Trend</label>
            <select
              id="trend-select"
              value={selectedTrend?.id || ''}
              onChange={(e) => navigate(`/editor/${e.target.value}`)}
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
            >
              {TRENDS.map(trend => (
                <option key={trend.id} value={trend.id}>{trend.name}</option>
              ))}
            </select>
          </div>
          {selectedTrend && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
                <h3 className="font-semibold text-gray-900 dark:text-white">Trend Prompt:</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">"{selectedTrend.prompt}"</p>
            </div>
          )}
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">2. Upload Your Image</label>
            <ImageUploader onImageSelect={handleImageSelect} imagePreviewUrl={imagePreviewUrl} clearImage={clearImage} />
          </div>
          <button
            onClick={handleGenerate}
            disabled={!selectedTrend || !userImage || isLoading}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-md text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SparklesIcon className="h-6 w-6" />
            <span>{isLoading ? 'Generating...' : 'Generate 3 Variations'}</span>
          </button>
           {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
        
        {/* Right Column: Result */}
        <div className="flex flex-col space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">3. Your Masterpiece</label>
            <div className="relative w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                {isLoading && <Loader />}
                {!isLoading && selectedImageUrl && (
                    <img src={selectedImageUrl} alt="Selected generated result" className="w-full h-full object-contain" />
                )}
                {!isLoading && !selectedImageUrl && (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <SparklesIcon className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600" />
                        <p className="mt-2">Your generated images will appear here.</p>
                    </div>
                )}
            </div>
            
            {generatedImageUrls.length > 0 && !isLoading && (
                 <div className="grid grid-cols-3 gap-2">
                    {generatedImageUrls.map((url, index) => (
                        <button key={index} onClick={() => setSelectedImageUrl(url)} className={`relative rounded-md overflow-hidden aspect-square focus:outline-none transition-all duration-200 ${selectedImageUrl === url ? 'ring-2 ring-neon-blue' : 'ring-0 ring-transparent hover:opacity-80'}`}>
                            <img src={url} alt={`Variation ${index + 1}`} className="w-full h-full object-cover"/>
                        </button>
                    ))}
                 </div>
            )}
            
            {selectedImageUrl && !isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onClick={handleDownload} className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <DownloadIcon className="h-5 w-5" />
                        <span>Download</span>
                    </button>
                     <button onClick={handleShare} className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <ShareIcon className="h-5 w-5" />
                        <span>Share</span>
                    </button>
                    <button onClick={handleSaveToGallery} className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <PlusCircleIcon className="h-5 w-5" />
                        <span>Save to Gallery</span>
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;