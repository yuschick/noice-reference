import { useMountEffect } from '@noice-com/common-react-core';
import classNames from 'classnames';
import { CSSProperties, SVGAttributes, useId, useRef } from 'react';

import styles from './Icon.module.css';

import { SvgComponent } from '@common-types';
import { getRem } from '@common-utils';

interface Props extends Omit<SVGAttributes<SVGElement>, 'role' | 'style'> {
  color?: string;
  icon: SvgComponent;
  size?: number;
  title?: string;
}

export function Icon({ color, icon: Icon, size, title, ...htmlAttributes }: Props) {
  const id = useId();
  const wrapper = useRef<HTMLSpanElement>(null);

  useMountEffect(() => {
    const wrapperElement = wrapper.current;

    if (!wrapperElement) {
      return;
    }

    const elementsWithId = wrapperElement.querySelectorAll('[id]');

    elementsWithId.forEach((element) => {
      const oldId = element.id;
      const newId = `${oldId}-${id}`;

      element.id = newId;

      wrapperElement
        .querySelectorAll(`[clip-path="url(#${oldId})"]`)
        .forEach((element) => {
          element.setAttribute('clip-path', `url(#${newId})`);
        });

      wrapperElement.querySelectorAll(`[fill="url(#${oldId})"]`).forEach((element) => {
        element.setAttribute('fill', `url(#${newId})`);
      });

      wrapperElement.querySelectorAll(`[stroke="url(#${oldId})"]`).forEach((element) => {
        element.setAttribute('stroke', `url(#${newId})`);
      });

      wrapperElement.querySelectorAll(`[filter="url(#${oldId})"]`).forEach((element) => {
        element.setAttribute('filter', `url(#${newId})`);
      });

      wrapperElement.querySelectorAll(`[mask="url(#${oldId})"]`).forEach((element) => {
        element.setAttribute('mask', `url(#${newId})`);
      });
    });
  });

  return (
    <span
      className={styles.iconWrapper}
      ref={wrapper}
      style={
        {
          '--_icon-color': color ? `var(--noi-color-${color})` : undefined,
          '--_icon-size': size ? getRem(size) : undefined,
        } as CSSProperties
      }
    >
      <Icon
        {...htmlAttributes}
        className={classNames(styles.icon, htmlAttributes.className)}
        role={title ? 'img' : 'presentation'}
        {...(title ? { title } : {})}
      />
    </span>
  );
}
