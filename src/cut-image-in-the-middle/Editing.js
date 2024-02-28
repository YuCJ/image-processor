import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
`;

function Editing({ imageDataUrl, cuts, sortedCutIds }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (imageDataUrl) {
      const image = new window.Image();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0);
      };
      image.src = imageDataUrl;
    }
  }, [imageDataUrl]);

  if (!imageDataUrl) {
    return 'no image';
  }

  return (
    <Container>
      <canvas ref={canvasRef}></canvas>
      <code>{JSON.stringify(sortedCutIds)}</code>
      <code>{JSON.stringify(cuts)}</code>
    </Container>
  );
}

Editing.propTypes = {
  imageDataUrl: PropTypes.string,
  cuts: PropTypes.arrayOf(
    PropTypes.shape({
      top: PropTypes.number.isRequired,
      bottom: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  sortedCutIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Editing;
