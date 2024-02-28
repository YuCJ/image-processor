import React from 'react';
import styled from 'styled-components';

const H1 = styled.h1`
  color: red;
`;

export default function Article() {
  return (
    <article>
      <H1>Example Page of React Static Site Template</H1>
      <p>
        See details at GitHub:{' '}
        <a href="https://github.com/YuCJ/react-static-site-template">
          YuCJ/react-static-site-template
        </a>
        .
      </p>
    </article>
  );
}
