/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, ChangeEvent, useCallback, useState } from 'react';
import { styled } from '@storybook/theming';

import { Form } from '../../form';
import { getControlId, getControlSetterButtonId } from './helpers';
import { ControlProps, TextConfig, TextValue } from '../../../types';

export type TextProps = ControlProps<TextValue | undefined> & TextConfig;

const Wrapper = styled.label({
  display: 'flex',
});

export const TextControl: FC<TextProps> = ({
  name,
  value,
  onChange,
  onFocus,
  onBlur,
}) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const [forceVisible, setForceVisible] = useState(false);
  const onForceVisible = useCallback(() => {
    onChange('');
    setForceVisible(true);
  }, [setForceVisible]);
  if (value === undefined) {
    return (
      // @ts-ignore
      <Form.Button id={getControlSetterButtonId(name)} onClick={onForceVisible}>
        Set string
      </Form.Button>
    );
  }

  const isValid = typeof value === 'string';
  return (
    <Wrapper>
      <Form.Textarea
        id={getControlId(name)}
        onChange={handleChange}
        size="flex"
        placeholder="Edit string..."
        autoFocus={forceVisible}
        valid={isValid ? null : 'error'}
        {...{ name, value: isValid ? value : '', onFocus, onBlur }}
      />
    </Wrapper>
  );
};
