
import React, { useState, useRef, useCallback } from 'react';
import { CameraIcon, UploadIcon, XIcon, ImageIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreviewUrl: string | null;
  clearImage: () => void;
}

const CameraCapture: React.FC<{ onCapture: (file: File) => void, onCancel: () => void }> = ({ onCapture, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
                alert("Could not access camera. Please ensure permissions are granted.");
                onCancel();
            }
        };
        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onCancel]);
    
    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
                canvasRef.current.toBlob(blob => {
                    if (blob) {
                        onCapture(new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' }));
                    }
                }, 'image/jpeg');
            }
        }
    };
    
    return (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
            <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-[70vh] rounded-lg"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="mt-4 flex space-x-4">
                <button onClick={handleCapture} className="px-6 py-2 bg-neon-blue text-black font-bold rounded-full">Capture</button>
                <button onClick={onCancel} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-full">Cancel</button>
            </div>
        </div>
    );
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imagePreviewUrl, clearImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleCameraCapture = (file: File) => {
    onImageSelect(file);
    setShowCamera(false);
  };
  
  if (showCamera) {
    return <CameraCapture onCapture={handleCameraCapture} onCancel={() => setShowCamera(false)} />;
  }
  
  if (imagePreviewUrl) {
    return (
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700">
        <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-contain" />
        <button onClick={clearImage} className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative w-full aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-6 transition-colors duration-300
        ${isDragging ? 'border-neon-blue bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}
    >
        <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-neon-blue cursor-pointer" onClick={openFileDialog}>Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
        />
         <button onClick={() => setShowCamera(true)} className="mt-4 flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <CameraIcon className="h-5 w-5" />
            <span>Use Camera</span>
        </button>
    </div>
  );
};

export default ImageUploader;
