import React, { useState } from "react";
import { FileText, Download } from "lucide-react";

interface FileItemProps {
  file: any;
  companyId: string;
  token: string;
  onDownloadError?: (error: string) => void;
}

import { buildApiUrl } from "../../config/api";

const FileItem: React.FC<FileItemProps> = ({
  file,
  companyId,
  token,
  onDownloadError,
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;

    setDownloading(true);
    try {
      const response = await fetch(
        buildApiUrl(`companies/${companyId}/files/${file.filename}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.originalName || file.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        onDownloadError && onDownloadError("Erro ao baixar arquivo");
      }
    } catch (error) {
      onDownloadError && onDownloadError("Erro de conexão durante o download");
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl border border-orange-200 border-opacity-20 hover:border-opacity-40 transition-all"
      style={{
        background: "rgba(30, 30, 30, 0.6)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="bg-orange-500 bg-opacity-20 p-2 rounded-lg flex-shrink-0">
          <FileText className="w-5 h-5 text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-white font-medium truncate"
            title={file.originalName || file.filename}
          >
            {file.originalName || file.filename}
          </p>
          <div className="flex items-center space-x-4 text-orange-200 text-sm mt-1">
            <span>{formatFileSize(file.size || file.length || 0)}</span>
            <span>•</span>
            <span>
              {file.uploadDate
                ? new Date(file.uploadDate).toLocaleDateString("pt-BR")
                : "Data não disponível"}
            </span>
            {file.contentType && (
              <>
                <span>•</span>
                <span className="uppercase">
                  {file.contentType.split("/")[1] || "FILE"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white p-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-md flex-shrink-0 ml-4 disabled:cursor-not-allowed"
        title="Baixar arquivo"
      >
        <Download className={`w-5 h-5 ${downloading ? "animate-pulse" : ""}`} />
      </button>
    </div>
  );
};

export default FileItem;
