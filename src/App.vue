<template>
  <Game />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Game from './components/Game.vue'

export default defineComponent({
  name: 'App',

  components: {
    Game,
  },
})
</script>

<style lang="scss">
  html {
    height: 100%;
  }

  body {
    height: 100%;
    min-height: 100%;
    padding: 0;
    margin: 0;

  }

  #app {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
