import React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/core/components/ui/button";

interface FileInputProps {
    value?: File[];
    onChange: (files: File[]) => void;
    multiple?: boolean;
    accept?: string;
    maxSize?: number; // в байтах
    className?: string;
    placeholder?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
    value = [],
    onChange,
    multiple = false,
    accept,
    maxSize,
    className = "",
}) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (maxSize) {
            const validFiles = files.filter(file => file.size <= maxSize);
            if (validFiles.length !== files.length) {
                alert("Некоторые файлы слишком большие");
            }
            onChange(multiple ? [...value, ...validFiles] : validFiles);
        } else {
            onChange(multiple ? [...value, ...files] : files);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = value.filter((_, i) => i !== index);
        onChange(newFiles);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Б";
        const k = 1024;
        const sizes = ["Б", "КБ", "МБ", "ГБ"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Нажмите для загрузки</span> или перетащите файлы
                        </p>
                        <p className="text-xs text-gray-500">
                            {accept ? `Поддерживаемые форматы: ${accept}` : "Любые файлы"}
                        </p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        multiple={multiple}
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </label>
            </div>

            {value.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Выбранные файлы:</h4>
                    <div className="space-y-2">
                        {value.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <Upload className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
