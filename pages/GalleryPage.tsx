
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneratedImage } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { DownloadIcon, ImageIcon } from '../components/icons';
import { TRENDS } from '../constants';

const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useLocalStorage<GeneratedImage[]>('trendai-gallery', []);
  const navigate = useNavigate();

  const sortedGallery = [...gallery].sort((a, b) => b.timestamp - a.timestamp);

  const downloadImage = (base64Image: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getTrendName = (trendId: string) => {
    return TRENDS.find(t => t.id === trendId)?.name || 'Unknown Trend';
  }

  if (gallery.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
         <ImageIcon className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Your Gallery is Empty</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Start creating amazing images in the editor to see them here.
        </p>
        <button
          onClick={() => navigate('/editor')}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
        >
          Go to Editor
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">My Gallery</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          All your amazing AI-generated creations in one place.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedGallery.map((image) => (
          <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
            <img src={image.generatedImage} alt={`Generated on ${new Date(image.timestamp).toLocaleString()}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-bold">{getTrendName(image.trendId)}</h3>
              <p className="text-xs text-gray-300">{new Date(image.timestamp).toLocaleDateString()}</p>
              <div className="mt-2">
                <button
                  onClick={() => downloadImage(image.generatedImage, `${image.id}.png`)}
                  className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
