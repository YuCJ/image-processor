import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Konva from 'konva';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const downloadURI = (uri, name) => {
  let link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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
        konvaRef.current.stage.width(image.width);
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

        const cutsCount = sortedCutIds.length;
        if (cutsCount > 0) {
          let konvaY = 0;
          const tasks = [];
          for (let i = 0; i <= cutsCount; i++) {
            const bitmapSy = i > 0 ? cuts[sortedCutIds[i - 1]].bottom : 0;
            const height =
              i < cutsCount
                ? cuts[sortedCutIds[i]].top - bitmapSy
                : image.height - bitmapSy;
            tasks.push({
              bitmapSy,
              bitmapSh: height,
              konvaY,
              konvaHeight: height,
            });
            konvaY += height;
          }

          Promise.all(
            tasks.map(task =>
              window
                .createImageBitmap(
                  image,
                  0,
                  task.bitmapSy,
                  image.width,
                  task.bitmapSh
                )
                .then(
                  sprite =>
                    new Konva.Image({
                      image: sprite,
                      y: task.konvaY,
                      width: image.width,
                      height: task.konvaHeight,
                    })
                )
            )
          ).then(konvaImages => {
            konvaRef.current.imageLayer.add(...konvaImages);
          });
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
      <button
        disabled={!imageDataUrl}
        onClick={() => {
          const dataURL = konvaRef.current.stage.toDataURL({ pixelRatio: 1 });
          downloadURI(dataURL, 'stage.png');
        }}
      >
        Download
      </button>
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
