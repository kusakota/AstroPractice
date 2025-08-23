<script setup>
import { ref } from 'vue';

// シートデフォルトの垂直位置
const scrollY = ref(500);
// ドラッグ中の状態
let startY = 0;
let baseY = scrollY.value;
let isDragging = false;

const maxScrollY = 1190;
const minScrollY = 10;

/**
 * onTouchStart: トッチドラッグ開始ハンドラ
 * - isDragging を true に設定
 * - ドラッグ開始位置 startY を記録
 * - 現在の scrollY 位置を baseY に保持
 * - touchmove と touchend リスナを登録
 * @param {TouchEvent} event - タッチ開始イベント
 */
function onTouchStart(event) {
  isDragging = true;
  startY = event.touches[0].clientY;
  baseY = scrollY.value;
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchend', onTouchEnd);
}

/**
 * onTouchMove: トッチドラッグ中の移動ハンドラ
 * - isDragging が true の場合のみ動作
 * - 移動量（event.touches[0].clientY - startY）を計算し scrollY を更新
 * @param {TouchEvent} event - タッチ移動イベント
 */
function onTouchMove(event) {
  if (!isDragging) return;
  const newY = baseY + (event.touches[0].clientY - startY);
  // ドラッグ中に下限を下回らないようクランプ
  scrollY.value = Math.max(minScrollY, newY);
}

/**
 * onTouchEnd: トッチドラッグ終了ハンドラ
 * - isDragging を false にリセット
 * - touchmove と touchend リスナを解除
 */
function onTouchEnd() {
  isDragging = false;
  // ドラッグ終了時にスクロール位置を範囲内にクランプ
  scrollY.value = Math.min(maxScrollY, Math.max(minScrollY, scrollY.value));
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);
}

/**
 * onMouseDown: マウスドラッグ開始ハンドラ
 * - isDragging を true に設定
 * - ドラッグ開始位置 startY と baseY を記録
 * - mousemove と mouseup リスナを登録
 * @param {MouseEvent} event - マウスダウンイベント
 */
function onMouseDown(event) {
  isDragging = true;
  startY = event.clientY;
  baseY = scrollY.value;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

/**
 * onMouseMove: マウスドラッグ中の移動ハンドラ
 * - isDragging が true の場合のみ動作
 * - 移動量（event.clientY - startY）を計算し scrollY を更新
 * @param {MouseEvent} event - マウス移動イベント
 */
function onMouseMove(event) {
  if (!isDragging) return;
  const newY = baseY + (event.clientY - startY);
  // ドラッグ中に下限を下回らないようクランプ
  scrollY.value = Math.max(minScrollY, newY);
}

/**
 * onMouseUp: マウスドラッグ終了ハンドラ
 * - isDragging を false にリセット
 * - mousemove と mouseup リスナを解除
 */
function onMouseUp() {
  isDragging = false;
  // ドラッグ終了時にスクロール位置を範囲内にクランプ
  scrollY.value = Math.min(maxScrollY, Math.max(minScrollY, scrollY.value));
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}
// --- ポインターイベントによる統合ドラッグ ---
/**
 * onPointerDown: ポインタ（タッチ/マウス）開始ハンドラ
 * - デフォルト動作を抑止
 * - isDragging, startY, baseY を初期化
 * - pointermove と pointerup リスナを登録
 * @param {PointerEvent} event - ポインタ開始イベント
 */
function onPointerDown(event) {
  event.preventDefault();
  isDragging = true;
  startY = event.clientY;
  baseY = scrollY.value;
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
}

/**
 * onPointerMove: ポインタ移動ハンドラ
 * - isDragging が true の場合のみ動作
 * - 移動量（event.clientY - startY）を計算し scrollY を更新
 * @param {PointerEvent} event - ポインタ移動イベント
 */
function onPointerMove(event) {
  if (!isDragging) return;
  const newY = baseY + (event.clientY - startY);
  // ドラッグ中に下限を下回らないようクランプ
  scrollY.value = Math.max(minScrollY, newY);
}

/**
 * onPointerUp: ポインタ終了ハンドラ
 * - isDragging を false にリセット
 * - pointermove と pointerup リスナを解除
 */
function onPointerUp() {
  isDragging = false;
  // ドラッグ終了時にスクロール位置を範囲内にクランプ
  scrollY.value = Math.min(maxScrollY, Math.max(minScrollY, scrollY.value));
  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('pointerup', onPointerUp);
}
</script>

<template>
  <div class="bottom-sheet__wrapper shadow" :style="`transform: translate3d(0px, ${scrollY}px, 0px)`" @touchstart="onTouchStart" @mousedown="onMouseDown" @pointerdown="onPointerDown">
      <div class="bottom-sheet__handle" >
        <div class="bottom-sheet__handle--bar" />
      </div>
      <div class="bottom-sheet__content">
        <slot />
      </div>
  </div>
</template>

<style lang="scss" scoped>
.bottom-sheet{
  &__wrapper {
    height: calc(100vh - 60px);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: grab;
  }
  &__handle {
    padding: 8px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    box-sizing: border-box;
    user-select: none; /* テキスト選択を防ぐ */
    &:active {
      cursor: grabbing;
    }
    &--bar {
      width: 40px;
      height: 4px;
      background-color: #ccc;
      border-radius: 2px;
      margin-top: 8px;
    }
  }
  &__content {
    padding: 0 16px 16px;
    overflow-y: auto;
    flex-grow: 1;
  }
}
.shadow {
  background-color: white;
  color: black;
  width: 100%;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  flex-direction: column;
}
</style>