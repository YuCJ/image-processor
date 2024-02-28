import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Konva from 'konva';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function Editing({ imageDataUrl, cuts, sortedCutIds, updateCut, removeCut }) {
  const stageRef = useRef(null);
  const konvaRef = useRef({});
  const drawCuts = useCallback(() => {
    if (konvaRef.current.cutsLayer) {
      const rects = sortedCutIds.map(
        id =>
          new Konva.Rect({
            x: 0,
            y: cuts[id].top,
            width: konvaRef.current.cutsLayer.width(),
            height: cuts[id].bottom - cuts[id].top,
            fill: 'black',
            strokeWidth: 0,
            opacity: 0.8,
          })
      );

      const cutRemoveButtons = sortedCutIds.map(id => {
        const label = new Konva.Label({
          x: konvaRef.current.cutsLayer.width() - 140,
          y: cuts[id].top + 5,
        });
        label.add(
          new Konva.Tag({
            fill: 'grey',
            pointerDirection: 'left',
            pointerWidth: 20,
            pointerHeight: 28,
            lineJoin: 'round',
          })
        );
        label.add(
          new Konva.Text({
            text: 'Remove Cut',
            fontFamily: 'Calibri',
            fontSize: 18,
            padding: 5,
            fill: 'white',
          })
        );
        label.on('click', () => {
          removeCut(id);
        });
        return label;
      });

      const trs = rects.map((rect, i) => {
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
        rect.on('transformend', function() {
          updateCut(sortedCutIds[i], {
            top: tr.y(),
            bottom: tr.y() + tr.height(),
          });
        });
        return tr;
      });

      konvaRef.current.cutsLayer.destroyChildren();
      konvaRef.current.cutsLayer.add(...rects);
      konvaRef.current.cutsLayer.add(...trs);
      konvaRef.current.cutsLayer.add(...cutRemoveButtons);
    }
  }, [cuts, sortedCutIds, updateCut, removeCut]);

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
        konvaRef.current.stage.width(image.width + 50);
        konvaRef.current.stage.height(image.height);
        konvaRef.current.image = new Konva.Image({
          image,
          width: image.width,
          height: image.height,
        });
        konvaRef.current.imageLayer.add(konvaRef.current.image);
        drawCuts();
      };
      image.src = imageDataUrl;
    }
  }, [imageDataUrl, drawCuts]);

  if (!imageDataUrl) {
    return 'no image';
  }

  return (
    <Container>
      <div ref={stageRef}></div>
      <div>{JSON.stringify(sortedCutIds)}</div>
      <div>{JSON.stringify(cuts, undefined, 2)}</div>
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
  removeCut: PropTypes.func.isRequired,
};

export default Editing;
