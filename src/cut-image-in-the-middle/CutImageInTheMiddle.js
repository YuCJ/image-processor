import React, { useState } from 'react';
import styled from 'styled-components';
import Editing from './Editing';
import PreviewIng from './PreviewIng';
import useCuts from './useCuts';
import ImageInput from '../ImageInput';

const Page = styled.div`
  padding: 20px 40px;
  background: #f1f1f1;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  width: 90%;
  margin: 10px auto;
`;

const H1 = styled.h1`
  color: red;
  text-align: center;
  margin-bottom: 15px;
`;

export default function CutImageInTheMiddle() {
  const [isEditing, setIsEditing] = useState(false);
  const [imageDataUrl, setImageDateUrl] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const {
    cuts,
    sortedIds: sortedCutIds,
    add: addCuts,
    clear: clearCuts,
    update: updateCut,
    remove: removeCut,
  } = useCuts();
  return (
    <Page>
      <H1>Cut Image in the Middle</H1>
      <Controls>
        <ImageInput
          onChange={result => {
            setImageDateUrl(result.imageDataUrl);
          }}
        />
      </Controls>
      <Controls>
        <button
          disabled={!isEditing && !imageDataUrl}
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </Controls>
      {isEditing ? (
        <Controls>
          <button
            onClick={() => {
              if (sortedCutIds.length > 0) {
                const lastCutBottom =
                  cuts[sortedCutIds[sortedCutIds.length - 1]].bottom;
                addCuts({
                  top: lastCutBottom + 30,
                  bottom: lastCutBottom + 60,
                });
              } else {
                addCuts({ top: 20, bottom: 50 });
              }
            }}
          >
            Add Cut
          </button>
          <button
            onClick={() => {
              clearCuts();
            }}
          >
            Clear
          </button>
        </Controls>
      ) : null}
      {showDebug ? (
        <>
          <div>sortedCutIds: {JSON.stringify(sortedCutIds)}</div>
          <div>cuts: {JSON.stringify(cuts, undefined, 2)}</div>
        </>
      ) : null}
      {isEditing ? (
        <Editing
          cuts={cuts}
          sortedCutIds={sortedCutIds}
          imageDataUrl={imageDataUrl}
          updateCut={updateCut}
          removeCut={removeCut}
        />
      ) : (
        <PreviewIng
          cuts={cuts}
          sortedCutIds={sortedCutIds}
          imageDataUrl={imageDataUrl}
        />
      )}
      <button
        style={{ position: 'absolute', top: '5px', left: '5px' }}
        onClick={() => {
          setShowDebug(!showDebug);
        }}
      >
        Debug
      </button>
    </Page>
  );
}
