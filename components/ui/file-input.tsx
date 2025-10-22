"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputFileProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  files: File[];
  onRemove: (index: number) => void;
  maxFiles: number;
}

export default function InputFile({ onFileChange, label, files, onRemove, maxFiles }: InputFileProps) {
  return (
    <div className="flex flex-col w-full max-w-2xl gap-4">
      {files.length === 0 && <div className="grid w-full items-center gap-3">
        <Label htmlFor="file-upload">{label}</Label>
        <Input 
          id="file-upload" 
          type="file" 
          accept=".tsx,.jsx,.vue,.svelte" 
          onChange={onFileChange}
          disabled={files.length >= maxFiles}
          className="cursor-pointer"
        />
        {maxFiles > 1 && <p className="text-xs text-fd-muted-foreground">
          {files.length}/{maxFiles} files selected
        </p>}
      </div>}
      
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file, index) => (
            <div 
              key={`${file.name}-${index}`}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                "bg-fd-secondary text-fd-secondary-foreground"
              )}
            >
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{file.name}</span>
                <span className="text-xs text-fd-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="ml-2 p-1 rounded-md hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}