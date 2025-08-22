<script setup lang="ts">
import BottomSheet from '../atoms/BottomSheet.vue';
import {ref} from 'vue'
const sheetState = ref('closed') // 'closed', 'partial', 'full'
</script>

<template>
  <BottomSheet :state="sheetState">
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
  </BottomSheet>
</template>