import React, { useRef } from "react";

interface FileAttachmentProps {
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  files,
  onChange,
  label,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    onChange([...files, ...selectedFiles]);
    e.target.value = ""; // para poder selecionar o mesmo arquivo novamente se quiser
  };

  const removeFile = (indexToRemove: number) => {
    const filtered = files.filter((_, i) => i !== indexToRemove);
    onChange(filtered);
  };

  const isExistingFile = (file: File) => {
    return (file as any).isExistingFile === true;
  };

  return (
    <div style={{ marginBottom: 24, marginTop: 10, color: "#eee" }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: "bold",
            color: "#eee",
          }}
        >
          {label}
        </label>
      )}

      {/* Input escondido */}
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {/* Botão customizado */}
      <button
        type="button"
        onClick={handleButtonClick}
        style={{
          backgroundColor: "#111",
          border: "1px solid #444",
          color: "#eee",
          padding: "10px 16px",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "600",
          fontSize: 14,
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#222";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#111";
        }}
      >
        Anexar arquivos
      </button>

      {/* Lista de arquivos em grid abaixo */}
      {files.length > 0 && (
        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 8,
          }}
        >
          {files.map((file, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                background: isExistingFile(file) ? "#1a1a2e" : "#111",
                border: "1px solid #333",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 50,
              }}
            >
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div
                  style={{
                    color: "#eee",
                    fontSize: 13,
                    fontWeight: "500",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    cursor: "default",
                  }}
                  title={file.name}
                >
                  {file.name}
                </div>
                <div
                  style={{
                    color: "#999",
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>

              {/* Badge para arquivos existentes */}
              {isExistingFile(file) && (
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    background:
                      "linear-gradient(135deg, #4a90e2 0%, #357abd 100%)",
                    color: "white",
                    fontSize: 9,
                    fontWeight: "bold",
                    padding: "4px 8px",
                    borderRadius: 12,
                    zIndex: 5,
                    boxShadow: "0 2px 8px rgba(74, 144, 226, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    backdropFilter: "blur(4px)",
                    minWidth: "60px",
                    textAlign: "center",
                    pointerEvents: "none",
                  }}
                >
                  Existente
                </div>
              )}

              <button
                onClick={() => removeFile(i)}
                type="button"
                aria-label={`Remover arquivo ${file.name}`}
                style={{
                  position: "absolute",
                  top: isExistingFile(file) ? 8 : 6,
                  right: isExistingFile(file) ? 8 : 6,
                  background: "rgba(244, 67, 54, 0.9)",
                  border: "none",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 12,
                  lineHeight: 1,
                  cursor: "pointer",
                  userSelect: "none",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  transition: "all 0.2s ease",
                  zIndex: 20,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(244, 67, 54, 1)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(244, 67, 54, 0.9)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileAttachment;
