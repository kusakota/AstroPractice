<template>
  <div class="hamb">
    <nav class="hamb__nav" >
      <ul class="hamb__menu">
        <li class="hamb__panel">
          <a class="hamb__panel__visble" href="/news/" @click="closeMenu">
            <span class="hamb__panel__text">ニュース</span>
          </a>
        </li>
        <li class="hamb__panel">
          <a class="hamb__panel__visble" href="/practice/" @click="closeMenu">
            <span class="hamb__panel__text">メニュー１</span>
          </a>
        </li>
        <li class="hamb__panel">
          <a class="hamb__panel__visble" href="/practice/" @click="closeMenu">
            <span class="hamb__panel__text">メニュー２</span>
          </a>
        </li>
      </ul> 
    </nav> 
  </div>
</template>
<script setup>
import { ref } from 'vue'

const hambflag = ref(false);
const scrollableflag = ref(false);

const emit =defineEmits(['closeMenu'])

const closeMenu = () => {
  emit('closeMenu');
}
</script>
<!--
<script>
export default {
  data() {
    return {
      hambflag: false,
      scrollableflag: false,
    }
  },
  methods: {
    closeMenu() {
      this.$emit('closeMenu')
      this.toggleScroll(true)
    },
  }
}
</script>
-->
<style lang='scss' scoped>
.hamb{
  &__nav{
  background-color: white;
  height: calc(100vh - 52px); //header height分マイナス
  width: 100%;
  overflow: hidden;
  }

  &__menu{
    list-style: none;
    padding-right: 1rem;
  }

  &__panel{
    width: 100%;
    margin-top: 1.2rem;
    padding-bottom: 4px;
    border-bottom: 1.5px solid black;
    &__visble{
      text-decoration: none;
      display: flex;
      align-items: center;
    }
    &__text{
      font-size: 18px;
      margin-left: 18px;
    }
  }
}
</style>