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
  .contents__wrapper {
    transform-origin: top center;
    margin: 20px auto 0;
    max-width: 450px;
    display: block;
  }
</style>