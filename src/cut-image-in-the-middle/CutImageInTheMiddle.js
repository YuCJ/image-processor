import React, { useRef } from 'react';
import styled from 'styled-components';
import useImageInput from '../useImageInput';

const H1 = styled.h1`
  color: red;
`;

export default function CutImageInTheMiddle() {
  const canvasRef = useRef(null);
  const drawImage = ({ imageDataUrl }) => {
    if (!imageDataUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const image = new window.Image();
    image.onload = () => {
      const width = image.width;
      const height = image.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0);
    };
    image.src = imageDataUrl;
  };

  const [input] = useImageInput({ onChange: drawImage });

  return (
    <div>
      <H1>CutImageInTheMiddle</H1>
      {input}
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
