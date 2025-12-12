// src/pages/AvatarUploader.jsx  ← THIS IS THE WINNING VERSION

import { useState } from "react";

export default function AvatarUploader({ currentAvatarUrl, onFileSelect }) {
  const [preview, setPreview] = useState(currentAvatarUrl);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Update preview immediately
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Send file to parent (Profile.jsx)
    onFileSelect(file); // THIS IS THE KEY
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <img
          src={preview || "/default-avatar.png"}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => e.target.src = "/default-avatar.png"}
        />
      </div>

      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition">
        Change Photo
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <p className="text-sm text-gray-500">Click to upload new photo</p>
    </div>
  );
}