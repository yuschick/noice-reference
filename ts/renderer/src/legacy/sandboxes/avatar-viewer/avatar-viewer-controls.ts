import * as THREE from 'three';

export class AvatarViewerControls extends THREE.EventDispatcher {
  public enabled: boolean;

  public rotationSpeed = 1.0;

  private _object?: THREE.Object3D;
  private _element: HTMLElement;

  private _mouseCoordinates?: THREE.Vector2;

  public constructor(object?: THREE.Object3D, element?: HTMLElement) {
    super();

    this.enabled = true;

    this._object = object;

    element ??= document.body;
    element.style.touchAction = 'none';

    element.addEventListener('mousedown', this._handleMouseButtonPress);
    element.addEventListener('mouseup', this._handleMouseButtonRelease);
    element.addEventListener('mouseout', this._handleMouseMovement);
    element.addEventListener('mousemove', this._handleMouseMovement);

    this._element = element;
  }

  public set object(object: THREE.Object3D) {
    if (this._object !== undefined) {
      object.rotation.copy(this._object.rotation);
    }

    this._object = object;
  }

  private _handleMouseButtonPress = (event: MouseEvent) => {
    if (this.enabled === false) {
      return;
    }

    this._mouseCoordinates ??= new THREE.Vector2();
    this._mouseCoordinates.set(event.clientX, event.clientY);
  };

  private _handleMouseButtonRelease = () => {
    if (this.enabled === false) {
      return;
    }

    this._mouseCoordinates = undefined;
  };

  private _handleMouseMovement = (event: MouseEvent) => {
    if (
      this.enabled === false ||
      this._object === undefined ||
      this._mouseCoordinates === undefined
    ) {
      return;
    }

    const mouseCoordinates = new THREE.Vector2();
    mouseCoordinates.set(event.clientX, event.clientY);

    const delta = mouseCoordinates
      .clone()
      .sub(this._mouseCoordinates)
      .multiplyScalar(this.rotationSpeed);

    this._object.rotation.y += (2.0 * Math.PI * delta.x) / this._element.clientHeight;

    this._mouseCoordinates.copy(mouseCoordinates);
  };

  public dispose(): void {
    this._element.removeEventListener('mousedown', this._handleMouseButtonPress);
    this._element.removeEventListener('mouseup', this._handleMouseButtonRelease);
    this._element.removeEventListener('mouseout', this._handleMouseMovement);
    this._element.removeEventListener('mousemove', this._handleMouseMovement);
  }
}
