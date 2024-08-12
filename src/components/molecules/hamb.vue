<template>
    <nav>
      <div class="hamb">
        <button class="hamb__button" @click="hambchange" aria-label="Navigation Menu">
            <span class="hamb__line hamb__line--line01" :class="{ 'v-line01': hambflag }" ></span>
            <span class="hamb__line hamb__line--line02" :class="{ 'v-line02': hambflag }" ></span>
            <span class="hamb__line hamb__line--line03" :class="{ 'v-line03': hambflag }" ></span>
        </button>
      </div>
    </nav>
    <Transition>
        <HambMenu class="hamb__menu" v-show="hambflag" @closeMenu="hambchange"/>
    </Transition>
</template>


<script setup>
import { ref } from 'vue';
import HambMenu from "../atoms/HambMenu.vue";

const hambflag = ref(false);
const scrollableflag = ref(false);

const hambchange = () => {
  hambflag.value = !hambflag.value;
  toggleScroll(!hambflag.value);
}

const closeMenu = () => {
  hambflag.value = false;
  toggleScroll(true);
}

const toggleScroll = (enable) => {
  if (!enable) {
        document.addEventListener("mousewheel", this.scrollControl, { passive: false });
        document.addEventListener("touchmove", this.scrollControl, { passive: false });
      } else {
        document.removeEventListener("mousewheel", this.scrollControl, { passive: false });
        document.removeEventListener("touchmove", this.scrollControl, { passive: false });
      }
}

const scrollControl =(event) => {
      event.preventDefault();
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
    hambchange() {
      this.hambflag = !this.hambflag
      this.toggleScroll(!this.hambflag)
      return this.hambflag
    },
    closeMenu() {
      this.hambflag = false
      this.toggleScroll(true)
      return this.hambflag
    },
    toggleScroll(enable) {
      if (!enable) {
        document.addEventListener("mousewheel", this.scrollControl, { passive: false });
        document.addEventListener("touchmove", this.scrollControl, { passive: false });
      } else {
        document.removeEventListener("mousewheel", this.scrollControl, { passive: false });
        document.removeEventListener("touchmove", this.scrollControl, { passive: false });
      }
    },
    scrollControl(event) {
      event.preventDefault();
    },
  }
}
</script>
-->
<style lang="scss" scoped>

.link{
  text-decoration: none;
  font-size: 17.2px;
}
ul {
  display: flex;
  list-style-type: none;
  gap: 1.5rem;
  align-items: center;
  padding: 0;
  margin: 0;
  width: 450px;
  @media (max-width: 875px){
    display: none;
  }
}
li {
  padding: 20px 0 8px 0;
  width: fit-content;
}

.hamb{
  &__button{
    z-index: calc(infinity);
    display: grid;
    place-content: center;
    text-align: center;
    height: 20px;
    width: 24px;
    margin: 16px 0 ;
    background-color: inherit;
    position: relative;
    border: none;
    z-index: 200;
  }

  &__line{
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 2px;
    background: black;
    border-radius: 1px;
    &--line01{
      top:0;
      transition: 0.4s ease;
    }
    &--line02{
      top:calc(100%/2);
      transition: 0.4s ease;
    }
    &--line03{
      top:calc(300%/3);
      transition: 0.4s ease;
    }
  }

  &__menu{
    position: fixed;
    top: 52px;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1000;
    overflow-y: auto;
  }
}

.v-enter-to {
  transition: transform 0.3s ease-out;
  transform: translateX(0px);
}

.v-enter-from {
  transform: translateY(calc(-100vh + 57.5px));
}

.v-leave-to {
  transition: transform 0.3s ease-out;
  transform: translateY(calc(-100vh + 57.5px));
}

.v-leave-from {
  transform: translateY(57.5px);
}

.v-line01 {
  transform: translateY(10px) rotate(-45deg);
  transition: 0.4s ease;
}
.v-line02 {
  transition: 0.4s ease;
  opacity: 0;
}
.v-line03 {
  transform: translateY(-10px) rotate(45deg);
  transition: 0.4s ease;
}
</style>