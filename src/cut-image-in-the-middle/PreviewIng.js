import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Konva from 'konva';

const Container = styled.div`
  background: #ffffff;
`;

function PreviewIng({ imageDataUrl, cuts, sortedCutIds }) {
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
        konvaRef.current.stage.height(
          sortedCutIds.reduce((accu, id) => {
            const cut = cuts[id];
            const cutHeight = cut.bottom - cut.top;
            if (!accu) {
              return image.height - cutHeight;
            }
            return accu - cutHeight;
          }, image.height)
        );

        if (sortedCutIds.length > 0) {
          const konvaImages = sortedCutIds.map(
            (id, i) =>
              new Konva.Image({
                image,
                width: image.width,
                y: i > 0 ? cuts[sortedCutIds[i - 1]].bottom : 0,
                height:
                  i > 0
                    ? cuts[sortedCutIds[id]].top -
                      cuts[sortedCutIds[i - 1]].bottom
                    : cuts[id].top,
              })
          );

          konvaImages.push(
            new Konva.Image({
              image,
              width: image.width,
              y: cuts[sortedCutIds[sortedCutIds.length - 1]].bottom,
              height:
                image.height -
                cuts[sortedCutIds[sortedCutIds.length - 1]].bottom,
            })
          );
          konvaRef.current.imageLayer.add(...konvaImages);
        } else {
          konvaRef.current.imageLayer.add(
            new Konva.Image({
              image,
              width: image.width,
              height: image.height,
              y: 0,
            })
          );
        }
      };
      image.src = imageDataUrl;
    }
  }, [imageDataUrl, cuts, sortedCutIds]);

  return (
    <Container>
      <div>{JSON.stringify(sortedCutIds)}</div>
      <div>{JSON.stringify(cuts, undefined, 2)}</div>
      <div ref={stageRef}></div>
    </Container>
  );
}

PreviewIng.propTypes = {
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

export default PreviewIng;
