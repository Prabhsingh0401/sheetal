import React from "react";

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  onMoveToWishlist: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  onConfirm,
  onCancel,
  onMoveToWishlist,
}) => {
  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      {/* Modal box */}
      <div
        className="bg-white p-2 shadow-2xl max-w-xs w-full font-montserrat font-optima"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-3">Remove Item</h2>

        <p className="text-gray-600 mb-5 text-sm">
          Are you sure you want to remove this item from your cart?
        </p>

        <div className="flex justify-between space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-black bg-gray-200 hover:bg-gray-300 transition-colors font-semibold text-sm"
          >
            Remove
          </button>

          <button
            onClick={onMoveToWishlist}
            className="flex-1 px-4 py-2 text-white bg-[#693e07] transition-colors font-semibold text-sm"
          >
            Move to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
