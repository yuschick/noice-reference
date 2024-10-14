// @see https://html.spec.whatwg.org/multipage/media.html#mediaerror
export enum MediaErrorCodes {
  Aborted = MediaError.MEDIA_ERR_ABORTED,
  Network = MediaError.MEDIA_ERR_NETWORK,
  Decode = MediaError.MEDIA_ERR_DECODE,
  NotSupported = MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
}
