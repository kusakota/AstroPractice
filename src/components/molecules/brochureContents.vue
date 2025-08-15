<template>
  <div class="swiper-container">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div v-for="num in 10" :key="num" class="swiper-slide">
          <!--
          <img :src="`/src/assets/images/${num}.jpg`" :alt="`Slide ${num}`" class="img" loading="lazy" />
          -->
          <p>Slide {{ num }}</p>
        </div>
      </div>
      <!-- ナビゲーションボタン -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

onMounted(async () => {
  // DOMの更新を待ってから初期化
  await nextTick();
    // Swiperの初期化
    const swiper = new Swiper('.swiper', {
      modules: [Navigation, Scrollbar],
      slidesPerView: 1,
      lazy: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      }
    });
});
</script>

<style lang="scss">
.swiper {
  width: 100%;
  position: relative;
  &-container {
    width: 100%;
    height: 100%;
    position: relative;
    margin-bottom: 30px; // スクロールバー用のスペース
  }
  &-button-prev,
  &-button-next {
    color: #007bff !important; // ボタンの色を設定
    &::after {
      font-size: 24px !important; // ボタンのサイズを調整
    }
    z-index: 10; // 高いz-indexを設定
  }
  &-pagination {
    position: absolute;
    height: 30px !important;
    bottom: -35px !important;
    text-align: center;
  }
  &-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.img {
  width: 100%;
  height: auto;
  max-height: 80vh; // 画像が大きすぎるのを防止
  object-fit: contain;
}
</style>