// eslint-disable-next-line no-restricted-imports
import { Graphics } from '@noice-com/web-renderer/src/legacy';
import { Component, ReactNode, RefObject, createRef } from 'react';

import styles from './RendererCanvasContainer.module.css';

interface Props {
  graphics: Graphics;
  dataFtueAnchor?: string;
}

export class RenderCanvasContainer extends Component<Props> {
  private _container: RefObject<HTMLDivElement>;
  private _graphics: Graphics;

  private _timeout?: number;

  public constructor(properties: Props) {
    super(properties);
    this._graphics = properties.graphics;

    this._container = createRef<HTMLDivElement>();
  }

  private _resize = (): void => {
    if (this._timeout) {
      window.clearTimeout(this._timeout);
    }

    this._timeout = window.setTimeout(() => {
      const container = this._container?.current;

      const width = container?.clientWidth ?? window.innerWidth;
      const height = container?.clientHeight ?? window.innerHeight;

      this._graphics.resize(width, height, window.devicePixelRatio);
    }, 100);
  };

  public override componentDidMount(): void {
    const container = this._container?.current;

    if (!container) {
      throw new Error('Bridge.container === undefined || Bridge.container === null');
    }

    container.appendChild(this._graphics.getRenderer().getCanvas());

    window.addEventListener('resize', this._resize);
    window.dispatchEvent(new Event('resize'));
  }

  public override componentDidUpdate(): void {
    const container = this._container.current;

    if (!container) {
      throw new Error('Bridge.container === undefined || Bridge.container === null');
    }

    if (this._graphics === this.props.graphics) {
      return;
    }

    container.removeChild(this._graphics.getRenderer().getCanvas());
    this._graphics = this.props.graphics;
    container.appendChild(this._graphics.getRenderer().getCanvas());
  }

  public override componentWillUnmount(): void {
    if (this._timeout) {
      window.clearTimeout(this._timeout);
    }

    window.removeEventListener('resize', this._resize);
  }

  public render(): ReactNode {
    return (
      <div
        className={styles.container}
        data-ftue-anchor={this.props.dataFtueAnchor}
        ref={this._container}
      />
    );
  }
}
