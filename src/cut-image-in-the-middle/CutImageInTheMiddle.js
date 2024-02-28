import React, { useState } from 'react';
import styled from 'styled-components';
import Editing from './Editing';
import PreviewIng from './PreviewIng';
import useCuts from './useCuts';
import ImageInput from '../ImageInput';

const Page = styled.div`
  padding: 20px 40px;
`;

const Controls = styled.div`
  text-align: center;
  width: 90%;
  margin: 10px auto;
`;

const H1 = styled.h1`
  color: red;
  text-align: center;
  margin-bottom: 15px;
`;

export default function CutImageInTheMiddle() {
  const [isEditing, setIsEditing] = useState();
  const [imageDataUrl, setImageDateUrl] = useState('');
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
                  top: lastCutBottom + 10,
                  bottom: lastCutBottom + 20,
                });
              } else {
                addCuts({ top: 10, bottom: 20 });
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
          <button
            onClick={() => {
              removeCut('2');
            }}
          >
            Remove Cut 2
          </button>
          <button
            onClick={() => {
              updateCut('2', { top: 5, bottom: 6 });
            }}
          >
            Update Cut 2
          </button>
        </Controls>
      ) : null}
      {isEditing ? (
        <Editing
          cuts={cuts}
          sortedCutIds={sortedCutIds}
          imageDataUrl={imageDataUrl}
        />
      ) : (
        <PreviewIng />
      )}
    </Page>
  );
}
