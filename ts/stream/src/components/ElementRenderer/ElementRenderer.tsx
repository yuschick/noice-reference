import { Nullable } from '@noice-com/utils';
import { useEffect, useRef } from 'react';

import styles from './ElementRenderer.module.css';

interface ElementRendererProps {
  element: Nullable<HTMLElement>;
  width: number;
  height: number;
}

export function ElementRenderer({ element, width, height }: ElementRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !element) {
      return;
    }

    const ref = containerRef.current;

    ref.appendChild(element);

    return () => {
      ref.removeChild(element);
    };
  }, [element, containerRef]);

  useEffect(() => {
    if (!element) {
      return;
    }

    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
  }, [element, width, height]);

  return (
    <div
      className={styles.container}
      ref={containerRef}
    ></div>
  );
}
