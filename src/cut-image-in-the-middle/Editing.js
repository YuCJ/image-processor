import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Konva from 'konva';

const Container = styled.div``;

function Editing({ imageDataUrl, cuts, sortedCutIds }) {
  const stageRef = useRef(null);
  const konvaRef = useRef({});

  // initialize
  useEffect(() => {
    if (stageRef.current) {
      const stage = new Konva.Stage({
        container: stageRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
      });
      const imageLayer = new Konva.Layer();
      const cutsLayer = new Konva.Layer();

      stage.add(imageLayer, cutsLayer);

      konvaRef.current.stage = stage;
      konvaRef.current.imageLayer = imageLayer;
      konvaRef.current.cutsLayer = cutsLayer;
    }
  }, []);

  // image
  useEffect(() => {
    if (imageDataUrl && konvaRef.current.imageLayer) {
      const image = new window.Image();
      image.onload = () => {
        konvaRef.current.image = new Konva.Image({
          image,
          width: image.width,
          height: image.height,
        });
        konvaRef.current.imageLayer.add(konvaRef.current.image);
      };
      image.src = imageDataUrl;
    }
  }, [imageDataUrl]);

  if (!imageDataUrl) {
    return 'no image';
  }

  return (
    <Container>
      <div ref={stageRef}></div>
      <code>{JSON.stringify(sortedCutIds)}</code>
      <code>{JSON.stringify(cuts)}</code>
    </Container>
  );
}

Editing.propTypes = {
  imageDataUrl: PropTypes.string,
  cuts: PropTypes.objectOf(
    PropTypes.shape({
      top: PropTypes.number.isRequired,
      bottom: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  sortedCutIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Editing;
