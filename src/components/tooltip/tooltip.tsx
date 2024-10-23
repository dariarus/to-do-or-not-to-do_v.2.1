import React, {FunctionComponent} from 'react';

import {TTooltip} from '../../services/types/props';

export const Tooltip: FunctionComponent<TTooltip> = (props) => {
  return (
    <span className={props.tooltipStyles}>
      {props.description}
    </span>
  )
}