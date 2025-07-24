<script setup lang="ts">
import { ref } from 'vue';
import Switches from '../atoms/switches.vue';

const zoomLevel = ref('100');
</script>

<template>
  <Switches v-model="zoomLevel" />
  <div
    class="contents__wrapper"
    :style="{ transform: `scale(${Number(zoomLevel) / 100})` }"
  >
    <slot />
  </div>
</template>

<style lang="scss">
  .contents {
    padding: 20px;
    overflow: auto;
  }
  
  .contents__wrapper {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 20px;
    transform-origin: top center;
    margin: 20px auto 0;
    max-width: 600px;
    display: block;
  }
</style>