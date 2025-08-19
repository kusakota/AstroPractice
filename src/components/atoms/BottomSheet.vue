<script setup>
import { ref, computed } from 'vue';

// props と emits
const props = defineProps({
  modelValue: {
    type: String,
    default: 'closed', // 'closed', 'partial'
    validator: (value) => ['closed', 'partial'].includes(value),
  },
});
const emit = defineEmits(['update:modelValue']);

// 内部の状態管理
const sheetState = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isDragging = ref(false);
const startY = ref(0);
const dragOffset = ref(0); // ドラッグ中のY軸移動量

// ドラッグ中のリアルタイムなスタイルを計算
const sheetStyle = computed(() => {
  // ドラッグ中は transition を 'none' にして指に追従させる
  const transition = isDragging.value ? 'none' : 'transform 0.3s ease-out';
  let transform = `translateY(${dragOffset.value}px)`;
  return { transition, transform };
});

// --- タッチイベントのハンドラ ---

function onTouchStart(event) {
  if (sheetState.value === 'partial' && event.target.closest('.content')) {
    // コンテンツ部分のスクロールを妨げないようにする
    return;
  }
  isDragging.value = true;
  startY.value = event.touches[0].clientY;
}

function onTouchMove(event) {
  if (!isDragging.value) return;

  const currentY = event.touches[0].clientY;
  const deltaY = currentY - startY.value;

  // 現在の状態に基づいてオフセットを計算
  const baseOffset = sheetState.value === 'partial' ? -300 : 0; // partial時のオフセットを考慮
  
  // 上方向へのスワイプのみを基本とするが、下方向への動きも許容する
  dragOffset.value = baseOffset + deltaY;
}

function onTouchEnd() {
  if (!isDragging.value) return;
  isDragging.value = false;

  const threshold = 50; // 状態を切り替えるための閾値 (50px)

  if (sheetState.value === 'closed' && dragOffset.value < -threshold) {
    // 閉じた状態から上に50px以上スワイプしたら partial にする
    sheetState.value = 'partial';
  } else if (sheetState.value === 'partial' && dragOffset.value > threshold) {
    // partial 状態から下に50px以上スワイプしたら closed にする
    sheetState.value = 'closed';
  }

  // ドラッグオフセットをリセットしてCSSクラスベースの位置に戻す
  dragOffset.value = 0;
}

// オーバーレイクリックで閉じる
const close = () => {
  isOpen.value = false;
};

</script>

<template>
  <div
    class="bottom-sheet-wrapper"
    :class="{ 'is-partial': sheetState === 'partial' }"
  >
    <div
      v-if="sheetState === 'partial'"
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

  /* 状態に応じた位置をtransformで管理 */
  /* calc(100% - var(--handle-height)) でハンドルの高さ分だけ見えるようにする */
  transform: translateY(calc(100% - var(--handle-height)));
  transition: transform 0.3s ease-out;
}

/* partial状態のときのシートの位置 */
.bottom-sheet-wrapper.is-partial .sheet {
  transform: translateY(calc(100% - var(--partial-height)));
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