<script lang="ts" setup>
import GameContainer from './components/GameContainer.vue'
</script>

<template>
  <ul>
    <li>Resume Game</li>
    <li>New Game</li>
  </ul>
  <GameContainer/>
</template>

<style>
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

  .center {
    text-align: center;
  }
</style>
