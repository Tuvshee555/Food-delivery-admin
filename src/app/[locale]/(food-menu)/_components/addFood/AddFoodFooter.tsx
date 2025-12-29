"use client";

interface Props {
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const AddFoodFooter = ({ loading, onCancel, onSubmit }: Props) => {
  return (
    <div className="flex justify-end mt-6 gap-2">
      <button
        onClick={onCancel}
        className="bg-gray-300 px-4 py-2 rounded-md text-sm"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-md text-sm disabled:bg-gray-400"
      >
        {loading ? "Adding..." : "Add Item"}
      </button>
    </div>
  );
};
