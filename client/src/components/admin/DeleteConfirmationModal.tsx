import React from "react";
import { AlertCircle, Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  companyName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  companyName,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center p-4">
      <div
        className="rounded-2xl max-w-md w-full p-8 shadow-2xl"
        style={{
          background: "rgba(139, 69, 19, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">
            Confirmar Exclusão
          </h3>

          <p className="text-orange-100 mb-2">
            Tem certeza de que deseja deletar todos os dados da empresa:
          </p>

          <p className="text-white font-bold text-lg mb-6 bg-red-500 bg-opacity-20 p-3 rounded-lg">
            {companyName}
          </p>

          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-red-200 font-semibold text-sm mb-1">
                  Esta ação é irreversível!
                </p>
                <p className="text-red-300 text-sm">
                  Todos os dados da empresa e arquivos anexados serão
                  permanentemente excluídos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Deletando...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Deletar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
