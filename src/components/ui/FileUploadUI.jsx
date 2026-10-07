import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react';
import FormField from './FormField';

export const FileUploadUI = ({
  id,
  label,
  hint,
  error,
  required,
  accept = '.pdf,.doc,.docx,.csv,.json',
  maxSizeMB = 10,
  onFilesSelected,
  disabled = false,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFilesSelected && onFilesSelected(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFilesSelected && onFilesSelected(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFilesSelected && onFilesSelected(null);
  };

  return (
    <FormField id={id} label={label} required={required} error={error} hint={hint} className={className}>
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center
          transition-all duration-150 cursor-pointer
          ${isDragging 
            ? 'border-brand-500 bg-brand-50/60' 
            : 'border-surface-border bg-surface hover:border-surface-border-strong hover:bg-canvas-subtle/40'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none bg-canvas-subtle' : ''}
          ${error ? 'border-red-300 bg-red-50/20' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          accept={accept}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
        />

        {selectedFile ? (
          <div className="flex items-center justify-between w-full max-w-sm px-3.5 py-2.5 bg-canvas-subtle border border-surface-border rounded-sm">
            <div className="flex items-center gap-2.5 truncate">
              <div className="p-1.5 bg-brand-100 text-brand-700 rounded-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left truncate">
                <span className="text-body-sm font-medium text-charcoal-900 truncate">
                  {selectedFile.name}
                </span>
                <span className="text-[11px] text-charcoal-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 text-charcoal-400 hover:text-charcoal-700 hover:bg-canvas-muted rounded-xs transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-canvas-subtle border border-surface-border flex items-center justify-center text-charcoal-600">
              <UploadCloud className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-body-sm font-medium text-charcoal-800">
                <span className="text-brand-600 hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-charcoal-400 mt-0.5">
                Supported formats: {accept.replace(/\./g, ' ').toUpperCase()} (up to {maxSizeMB}MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </FormField>
  );
};

export default FileUploadUI;
