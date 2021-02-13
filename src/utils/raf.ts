export interface IAnimationFrameRequest {
  canceled: boolean;
}

export function setFrameTimeout(
  callback: () => void,
  delay: number = 0
): IAnimationFrameRequest {
  const request = {canceled: false};
  const initial = performance.now();

  function listener(timestamp: number) {
    if (request.canceled === true) return;
    if (timestamp - initial >= delay) {
      callback();
    } else {
      window.requestAnimationFrame(listener);
    }
  }

  listener(initial);
  return request;
}

export function setFrameInterval(
  callback: () => void,
  delay: number = 0
): IAnimationFrameRequest {
  const request = {canceled: false};
  let initial: number = performance.now();

  function listener(timestamp: number) {
    if (request.canceled === true) return;
    if (timestamp - initial >= delay) {
      initial = timestamp;
      callback();
    }
    window.requestAnimationFrame(listener);
  }

  listener(initial);
  return request;
}

export function clearFrameRequest(request: IAnimationFrameRequest | void) {
  if (request) request.canceled = true;
}
