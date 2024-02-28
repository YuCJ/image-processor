import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Konva from 'konva';

const Container = styled.div`
  background: #ffffff;
`;

function Editing({ imageDataUrl, cuts, sortedCutIds, updateCut }) {
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

  // cuts
  useEffect(() => {
    if (konvaRef.current.cutsLayer) {
      konvaRef.current.cutsLayer.destroyChildren();
      const rects = sortedCutIds.map(
        id =>
          new Konva.Rect({
            x: 0,
            y: cuts[id].top,
            width: konvaRef.current.cutsLayer.width(),
            height: cuts[id].bottom - cuts[id].top,
            fill: 'green',
            strokeWidth: 0,
          })
      );
      konvaRef.current.cutsLayer.add(...rects);
      rects.forEach((rect, i) => {
        const tr = new Konva.Transformer({
          nodes: [rect],
          enabledAnchors: ['top-center', 'bottom-center'],
          rotateEnabled: false,
          flipEnabled: false,
          keepRatio: false,
          boundBoxFunc: function(oldBoundBox, newBoundBox) {
            const minHeight = 10;
            if (
              // newBoundBox.y < minY
              newBoundBox.y <
                (i > 0 ? Math.ceil(cuts[sortedCutIds[i - 1]].bottom) + 5 : 0) ||
              // newBoundBox.y+height> max y+height
              newBoundBox.y + newBoundBox.height >
                (i < sortedCutIds.length - 1
                  ? Math.floor(cuts[sortedCutIds[i + 1]].top) - 5
                  : konvaRef.current.image.height()) ||
              // newBoundBox.height < minHeight
              newBoundBox.height < minHeight ||
              // newBoundBox.y > maxY
              newBoundBox.y > konvaRef.current.image.height() - minHeight
            ) {
              return oldBoundBox;
            }
            return newBoundBox;
          },
        });
        konvaRef.current.cutsLayer.add(tr);
        rect.on('transformend', function() {
          updateCut(sortedCutIds[i], {
            top: tr.y(),
            bottom: tr.y() + tr.height(),
          });
        });
      });
    }
  }, [cuts, sortedCutIds, updateCut]);

  if (!imageDataUrl) {
    return 'no image';
  }

  return (
    <Container>
      <div>{JSON.stringify(sortedCutIds)}</div>
      <div>{JSON.stringify(cuts, undefined, 2)}</div>
      <div ref={stageRef}></div>
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
  updateCut: PropTypes.func.isRequired,
};

export default Editing;
