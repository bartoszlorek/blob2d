# Common Utilities

## Table of Contents

- [Array](#-array)
- [Device](#-device)
- [Easing](#-easing)
- [Math](#-math)
- [RAF](#-raf)

## 🗄 Array

### **refineArray**

Returns an element wrapped in an array or unchanged when it's already an array.

```ts
function refineArray<T>(arr: T | T[]): T[];
```

### **concatArray**

Combines two similar arrays.

```ts
function concatArray<T>(arr1: T[], arr2: T[]): T[];
```

### **arrayRemove**

Removes an element from an array without generating garbage.

```ts
function arrayRemove<T>(arr: T[], item: T): boolean;
```

## 🖥 Device

```ts
function isTouchDevice(): boolean;
```

## 🎢 Easing

Set of easing functions for a smooth motion. https://matthewlein.com/tools/ceaser

```ts
interface easing {
  linear

  // quadratic functions
  easeInQuad
  easeOutQuad
  easeInOutQuad

  // cubic functions
  easeInCubic
  easeOutCubic
  easeInOutCubic

  // quartic functions
  easeInQuart
  easeOutQuart
  easeInOutQuart

  // quintic functions
  easeInQuint
  easeOutQuint
  easeInOutQuint

  // elastic functions
  easeInElastic
  easeOutElastic
  easeInOutElastic
}
```

## 📐 Math

### **lerp**

Linear interpolation between two values.

```ts
function lerp(
  start: number,    // returned when bias = 0
  end: number,      // returned when bias = 1
  bias: number,     // [0-1] interpolation between start and end
  error: number = 0 // snaps bias to the start or end
): number;
```

### **sign**

Returns the sign of the number. It indicates whether the given number is positive, negative or zero.

```ts
function sign(value: number): -1 | 0 | 1;
```

### **randomInt**

Returns a random integer number between min (inclusive) and max (inclusive) values.

```ts
function randomInt(): number;                         // 0-1
function randomInt(max: number): number;              // 0-max
function randomInt(min: number, max: number): number; // min-max
```

### **randomFloat**

Returns a random float number between min (inclusive) and max (inclusive) values.

```ts
function randomFloat(): number;                         // 0-1
function randomFloat(max: number): number;              // 0-max
function randomFloat(min: number, max: number): number; // min-max
```

## 🎬 RAF

Timing methods based on `window.requestAnimationFrame()` which tells the browser to call specified function before the next repaint.

https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

### **setFrameTimeout**

It's similar to the native `setTimeout` function in JavaScript.

```ts
function setFrameTimeout(callback: () => void, delay: number = 0): IAnimationFrameRequest;
```

### **setFrameInterval**

It's similar to the native `setInterval` function in JavaScript.

```ts
function setFrameInterval(callback: () => void, delay: number = 0): IAnimationFrameRequest;
```

### **clearFrameRequest**

Clears both `setFrameTimeout` and `setFrameInterval` methods.

```ts
function clearFrameRequest(request: IAnimationFrameRequest | void): void;
```
