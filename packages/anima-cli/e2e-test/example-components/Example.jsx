import React from 'react';

function Example({ text, isActive, variant }) {
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
