import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEventHandler, ReactElement } from 'react';

interface Props {
  icon: IconDefinition;
  onClick?: MouseEventHandler<HTMLSpanElement>;
  size?: SizeProp | undefined;
}

export default function Icon({ icon, onClick, size = 'lg' }: Props): ReactElement {
  return (
    <span onClick={onClick} style={{ marginRight: '5px', cursor: onClick ? 'pointer': 'default' }}>
      <FontAwesomeIcon size={size} icon={icon} />
    </span>
  );
}
