import React from 'react';
import { ExampleProps } from './ExampleTypes';

function Example(props: ExamExamplePropspleTypes) {
  return (
    <span>
      {text}
      {isActive && '!'}
      {variant === 'primary' && '?'}
      {variant === 'secondary' && '&'}
    </span>
  );
}

export default Example;
