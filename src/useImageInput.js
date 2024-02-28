import React, { useState } from 'react';

const defaultInputAccept = 'image/*';

export default function useImageInput({ onChange, inputAccept } = {}) {
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new window.FileReader();
    reader.onload = event => {
      setImageFile(event.target.result);
      if (typeof onChange === 'function') {
        onChange({ imageDataUrl: event.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const input = (
    <input
      type="file"
      accept={inputAccept ?? defaultInputAccept}
      onChange={handleFileChange}
    />
  );

  return [input, imageFile];
}
