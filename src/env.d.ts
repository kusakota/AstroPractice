/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// このブロックを追加
declare module "*?arraybuffer" {
  const buffer: ArrayBuffer;
  export default buffer;
}