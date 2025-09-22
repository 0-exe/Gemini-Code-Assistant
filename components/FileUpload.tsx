import React, { useCallback, useState } from 'react';
import { UploadedFile } from '../types';
import { UploadIcon, FileIcon, XMarkIcon } from './Icons';

interface FileUploadProps {
  onFileChange: (file: UploadedFile) => void;
  onFileRemove: () => void;
  file: UploadedFile | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, onFileRemove, file }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile) {
        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
            setError("File size exceeds 10MB limit.");
            return;
        }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onFileChange({
          name: selectedFile.name,
          mimeType: selectedFile.type,
          data: base64String,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleRemoveFile = () => {
    onFileRemove();
    setError(null);
    const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  return (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
            Reference File (Optional)
        </label>
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full p-4 bg-gray-900/50 border-2 border-dashed rounded-lg text-gray-400 transition duration-200 ${isDragging ? 'border-purple-500' : 'border-white/20'}`}
        >
            <input 
                type="file" 
                id="file-upload-input" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileInputChange}
            />
            {file ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <FileIcon />
                        <span className="font-medium text-gray-300 truncate">{file.name}</span>
                    </div>
                    <button onClick={handleRemoveFile} className="text-gray-400 hover:text-white z-10" aria-label="Remove file">
                        <XMarkIcon />
                    </button>
                </div>
            ) : (
                <div className="text-center pointer-events-none">
                    <div className="flex justify-center text-gray-400">
                        <UploadIcon />
                    </div>
                    <p className="mt-2 text-sm">
                        <span className="font-semibold text-purple-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Any file type up to 10MB</p>
                </div>
            )}
        </div>
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  );
};

export default FileUpload;
