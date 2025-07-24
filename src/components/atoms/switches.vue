<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(['update:modelValue']);

const zoomLevel = ref(props.modelValue ?? '100');

const maxZoom = 300; // 最大倍率
const minZoom = 100; // 最小倍率
const step = 25; // ズームステップ

// modelValueが変化したらzoomLevelも更新
watch(() => props.modelValue, (val) => {
  zoomLevel.value = val;
});

// zoomLevelが変化したら親に通知
watch(zoomLevel, (val) => {
  emit('update:modelValue', val);
});
const normalizeZoom = (val: string | number) => {
  let num = Number(val);
  if (isNaN(num) || val === '') return 100;
  if (num > maxZoom) return maxZoom;
  if (num < minZoom) return minZoom;
  return num;
};

const zoomIn = () => {
  let num = normalizeZoom(zoomLevel.value);
  if (num < maxZoom - step) {
    num += step;
  } else {
    num = maxZoom;
  }
  zoomLevel.value = String(num);
};

const zoomOut = () => {
  let num = normalizeZoom(zoomLevel.value);
  if (num > minZoom + step) {
    num -= step;
  } else {
    num = minZoom;
  }
  zoomLevel.value = String(num);
};

function onInputBlur() {
  zoomLevel.value = String(normalizeZoom(zoomLevel.value));
}

// Enterキーでblurを実行
function onInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    (e.target as HTMLInputElement).blur();
  }
}
</script>

<template>
  <section class="switch">
    <div class="zoom-controls">
      <button
        id="zoomOutBtn"
        class="zoom-btn zoom-out"
        :class="{ 'zoom-out-disabled': Number(zoomLevel) <= 100 }"
        @click="zoomOut"
        :disabled="Number(zoomLevel) <= 100"
      >
        <span class="icon">ー</span>
      </button>
      <div class="zoom-level-container">
        <input
          type="text"
          class="zoom-level"
          id="zoomLevelInput"
          v-model="zoomLevel"
          @blur="onInputBlur"
          @keydown="onInputKeydown"
        />
        <span>%</span>
      </div>
      <button
        id="zoomInBtn"
        class="zoom-btn zoom-in"
        @click="zoomIn"
        :disabled="Number(zoomLevel) >= 300"
      >
        <span class="icon">＋</span>
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.switch {
  text-align: center;
}

.zoom-controls {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.zoom-btn {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #0056b3;
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.zoom-out {
  background: #dc3545;

  &:hover:not(:disabled) {
    background: #c82333;
  }
}

.icon {
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 1.2rem;
}

.zoom-level {
  font-weight: 600;
  font-size: 1.3rem;
  color: #495057;
  width: 4.2rem;
  height: 2.2rem;
  text-align: center;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  background: #fff;
  margin: 0 0.5rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
}

.contents {
  padding: 1.25rem;
  overflow: auto;
}

.contents__wrapper {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 1.25rem;
  transition: transform 0.5s ease;
  transform-origin: center;
  margin: 0 auto;
  max-width: 37.5rem;
}
</style>