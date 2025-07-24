<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(['update:modelValue']);

const zoomLevel = ref(props.modelValue ?? '100');

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
  if (num > 300) return 300;
  if (num < 100) return 100;
  return num;
};

const zoomIn = () => {
  let num = normalizeZoom(zoomLevel.value);
  if (num < 275) {
    num += 25;
  } else {
    num = 300;
  }
  zoomLevel.value = String(num);
};

const zoomOut = () => {
  let num = normalizeZoom(zoomLevel.value);
  if (num > 125) {
    num -= 25;
  } else {
    num = 100;
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
      <input
        type="text"
        class="zoom-level"
        id="zoomLevelInput"
        v-model="zoomLevel"
        @blur="onInputBlur"
        @keydown="onInputKeydown"
      />
      <button
        id="zoomInBtn"
        class="zoom-btn zoom-in"
        @click="zoomIn"
        :disabled="Number(zoomLevel) >= 300"
      >
        <span class="icon">+</span>
      </button>
    </div>
  </section>
</template>

<style>
.switch {
  margin: 20px 0  3rem 0;
  text-align: center;
}

.zoom-controls {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  background: #f8f9fa;
  padding: 10px 20px;
  border-radius: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.zoom-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: scale(1.1);
}

.zoom-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.zoom-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.zoom-out {
  background: #dc3545;
}

.zoom-out:hover:not(:disabled) {
  background: #c82333;
}

.icon {
  font-weight: bold;
  font-size: 20px;
  line-height: 1;
}

.zoom-level {
  font-weight: 600;
  font-size: 1.3rem;
  color: #495057;
  width: 75px;
  height: 35px;
  text-align: center;
}

.contents {
  padding: 20px;
  overflow: auto;
}

.contents__wrapper {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.5s ease;
  transform-origin: center;
  margin: 0 auto;
  max-width: 600px;
}
</style>