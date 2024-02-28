import React from 'react';
import PropTypes from 'prop-types';

function ImageInput({ accept, onChange }) {
  const handleFileChange = event => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new window.FileReader();
    reader.onload = event => {
      if (typeof onChange === 'function') {
        onChange({
          imageDataUrl: event.target.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return <input type="file" accept={accept} onChange={handleFileChange} />;
}

ImageInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
};

ImageInput.defaultProps = {
  accept: 'image/*',
};

export default ImageInput;
