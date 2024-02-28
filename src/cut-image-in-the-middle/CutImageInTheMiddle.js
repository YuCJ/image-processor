import React, { useState } from 'react';
import styled from 'styled-components';
import Editing from './Editing';
import PreviewIng from './PreviewIng';

const Page = styled.div`
  padding: 20px 40px;

  & > * {
    margin-bottom: 5px;
  }
`;

const Controls = styled.div`
  text-align: center;
  width: 90%;
  margin: 0 auto;
`;

const H1 = styled.h1`
  color: red;
  text-align: center;
`;

export default function CutImageInTheMiddle() {
  const [isEditing, setIsEditing] = useState();
  return (
    <Page>
      <H1>Cut Image in the Middle</H1>
      <Controls>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
      </Controls>
      {isEditing ? Editing : PreviewIng}
    </Page>
  );
}
