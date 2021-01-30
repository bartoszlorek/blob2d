export interface IAnimationFrameRequest {
  canceled: boolean;
}

export function setFrameTimeout(
  callback: () => void,
  delay: number
): IAnimationFrameRequest {
  const initial = performance.now();
  const request = {canceled: false};

  function listener() {
    if (request.canceled === false) {
      const current = performance.now();

      if (current - initial >= delay) {
        callback();
      } else {
        window.requestAnimationFrame(listener);
      }
    }
  }

  listener();
  return request;
}

export function setFrameInterval(
  callback: () => void,
  delay: number
): IAnimationFrameRequest {
  let initial = performance.now();
  const request = {canceled: false};

  function listener() {
    if (request.canceled === false) {
      const current = performance.now();

      if (current - initial >= delay) {
        initial = current;
        callback();
      }

      window.requestAnimationFrame(listener);
    }
  }

  listener();
  return request;
}

export function clearFrameRequest(
  request: IAnimationFrameRequest | null | void
) {
  if (request) {
    request.canceled = true;
  }
}
