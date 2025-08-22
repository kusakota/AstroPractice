<script setup>
import { ref, computed, watch } from 'vue';
let scrollY = ref(-800)
</script>

<template>
  <div class="bottom-sheet__wrapper shadow" :style="`transform: translate3d(0px, ${scrollY}px, 0px)`">
      <div class="bottom-sheet__handle">
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