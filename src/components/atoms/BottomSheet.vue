<script setup>
import { ref, computed, watch } from 'vue';

// props と emits
const props = defineProps({
  modelValue: {
    type: String,
    default: 'closed', // 'closed', 'partial', 'half', 'full'
    validator: (value) => ['closed', 'partial', 'half', 'full'].includes(value),
  },
});
const emit = defineEmits(['update:modelValue']);

// computedプロパティで v-model と連携し、'closed' または 'partial' の状態を管理
const sheetState = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// 「今、まさにドラッグしている最中か？」を判定するフラグ (true/false)
const isDragging = ref(false);

// ドラッグを開始した最初の指のY座標を記録する場所
const startY = ref(0);

// ドラッグ中にどれだけ指が動いたかの距離（オフセット）を記録する場所
const dragOffset = ref(0);

// ドラッグ中のリアルタイムなスタイルを計算
const sheetStyle = computed(() => {
  // ドラッグ中は transition を 'none' にして指に追従させる
  const transition = isDragging.value ? 'none' : 'transform 0.3s ease-out';
  let transform = `translateY(${dragOffset.value}px)`;
  return { transition, transform };
});

// --- 共通のドラッグ開始処理 ---
function startDrag(clientY) {
  isDragging.value = true;
  startY.value = clientY;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

// --- タッチイベントのハンドラ ---

function onTouchStart(event) {
  if (sheetState.value === 'partial' && event.target.closest('.content')) {
    // コンテンツ部分のスクロールを妨げないようにする
    return;
  }
  startDrag(event.touches[0].clientY);
}

function onTouchMove(event) {
  if (!isDragging.value) return;
  updateDragPosition(event.touches[0].clientY);
}

function onTouchEnd() {
  endDrag();
}

// --- マウスイベントのハンドラ ---

function onMouseDown(event) {
  if (sheetState.value === 'partial' && event.target.closest('.content')) {
    // コンテンツ部分のスクロールを妨げないようにする
    return;
  }
  event.preventDefault(); // テキスト選択などを防ぐ
  startDrag(event.clientY);
}

function onMouseMove(event) {
  if (!isDragging.value) return;
  updateDragPosition(event.clientY);
}

function onMouseUp() {
  endDrag();
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

// --- 共通のドラッグ処理 ---

function updateDragPosition(clientY) {
  const deltaY = clientY - startY.value;

  // 現在の状態に基づいてベースオフセットを設定
  let baseOffset = 0;
  if (sheetState.value === 'partial') {
    baseOffset = -300; // partial時のオフセット
  } else if (sheetState.value === 'half') {
    baseOffset = -(window.innerHeight * 0.5); // half時のオフセット（画面の半分）
  } else if (sheetState.value === 'full') {
    baseOffset = -(window.innerHeight * 0.8); // full時のオフセット（画面の80%）
  }
  
  // ドラッグ中のリアルタイム位置を計算
  dragOffset.value = baseOffset + deltaY;
}

function endDrag() {
  if (!isDragging.value) return;
  isDragging.value = false;

  const threshold = 60; // 状態を切り替えるための閾値 (60px)
  const halfOffset = -(window.innerHeight * 0.5); // 画面の半分のオフセット
  const fullOffset = -(window.innerHeight * 0.8); // 画面の80%のオフセット

  if (sheetState.value === 'closed') {
    // 上向きのドラッグで閾値を超えた場合のみ partial にする
    if (dragOffset.value < -threshold) {
      sheetState.value = 'partial';
    }
  } else if (sheetState.value === 'partial') {
    if (dragOffset.value < -300 - threshold) {
      // 上向きドラッグで閾値を超えたら half にする
      sheetState.value = 'half';
    } else if (dragOffset.value > -300 + threshold) {
      // 下向きドラッグで閾値を超えたら closed にする
      sheetState.value = 'closed';
    }
  } else if (sheetState.value === 'half') {
    if (dragOffset.value < halfOffset - threshold) {
      // 上向きドラッグで閾値を超えたら full にする
      sheetState.value = 'full';
    } else if (dragOffset.value > halfOffset + threshold) {
      // 下向きドラッグで閾値を超えたら partial にする
      sheetState.value = 'partial';
    }
  } else if (sheetState.value === 'full') {
    if (dragOffset.value > fullOffset + threshold) {
      // 下向きのドラッグで閾値を超えたら half にする
      sheetState.value = 'half';
    }
  }

  // ドラッグオフセットをリセットしてCSSクラスベースの位置に戻す
  dragOffset.value = 0;
}

// オーバーレイクリックで閉じる
function close() {
  sheetState.value = 'closed';
}
</script>

<template>
  <div
    class="bottom-sheet-wrapper"
    :class="{ 
      'is-partial': sheetState === 'partial',
      'is-half': sheetState === 'half',
      'is-full': sheetState === 'full'
    }"
  >
    <div
      v-if="sheetState === 'partial' || sheetState === 'half' || sheetState === 'full'"
      class="overlay"
      @click="close"
    ></div>

    <div
      class="sheet"
      :class="{ 'is-dragging': isDragging }"
      :style="sheetStyle"
      @touchmove.prevent="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        class="handle-bar"
        @touchstart.passive="onTouchStart"
        @mousedown="onMouseDown"
      >
        <div class="handle"></div>
      </div>

      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CSSカスタムプロパティで高さを管理 */
:root {
  --handle-height: 36px; /* ハンドル領域の高さ */
  --partial-height: 300px; /* partial時のシートの高さ */
  --half-height: 50vh; /* half時のシートの高さ（画面の半分） */
  --full-height: 80vh; /* full時のシートの高さ */
}

.bottom-sheet-wrapper {
  /* v-if を外したので、常に画面下に配置される */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1; /* シートより後ろに配置 */
}

.sheet {
  background-color: white;
  color: black;
  width: 100%;
  max-width: 640px;
  height: 90vh; /* 全開時の高さを定義 */
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;

  /* デフォルト（closed）状態：ハンドルバーのみ表示 */
  transform: translateY(calc(100% - var(--handle-height)));
  transition: transform 0.3s ease-out;
  
  /* closed状態でコンテンツ部分を非表示にする */
  overflow: hidden;
}

/* partial状態のときのシートの位置 */
.bottom-sheet-wrapper.is-partial .sheet {
  transform: translateY(calc(100% - var(--partial-height)));
}

/* half状態のときのシートの位置（画面の半分） */
.bottom-sheet-wrapper.is-half .sheet {
  transform: translateY(calc(100% - var(--half-height)));
}

/* full状態のときのシートの位置 */
.bottom-sheet-wrapper.is-full .sheet {
  transform: translateY(calc(100% - var(--full-height)));
}

.sheet.is-dragging {
  /* ドラッグ中はアニメーションを無効化 */
  transition: none;
}

.handle-bar {
  padding: 8px;
  cursor: grab;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  height: var(--handle-height);
  box-sizing: border-box;
  user-select: none; /* テキスト選択を防ぐ */
}

.handle-bar:active {
  cursor: grabbing;
}
.handle {
  width: 40px;
  height: 4px;
  background-color: #ccc;
  border-radius: 2px;
  margin-top: 8px;
}

.content {
  padding: 0 16px 16px;
  overflow-y: auto;
  flex-grow: 1;
}
</style>