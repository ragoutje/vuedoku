<template>
  <div class="game">
    <h1>Vuedoku</h1>
    <Grid :cells="cells" />
    <NumberPicker @selectNumber="selectNumberHandler" />

    <div class="action-menu">
      <ActionItem command="highlight" text="Highlight" @action="actionHandler" :class="{'active': highlighting}" />
      <ActionItem command="hint" text="Hint" @action="actionHandler" />
      <ActionItem command="solve" text="Auto-solve" @action="actionHandler" />
      <ActionItem command="reset" text="Restart" @action="actionHandler" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ActionItem from './ActionItem.vue';
import Grid from './Grid.vue';
import NumberPicker from './NumberPicker.vue';
import {generateGrid} from "../services/GridGenerator/GridGenerator";

const cells = generateGrid(sudoku);

export default defineComponent({
  name: 'Game',

  components: {
    ActionItem,
    Grid,
    NumberPicker,
  },

  setup () {
    return {
      cells,
    };
  },
});
</script>

<style lang="scss">
  h1 {
    text-align: center;
  }
  .game {
    width: 50vh;
    margin: 0 auto;

    @media (orientation: portrait) {
      width: 50vw;
    }
  }

  .action-menu {
    display: grid;
    grid-gap: 1px;
    grid-template-columns: repeat(4, 1fr);

    .action-item {
      margin-top: 2.5vw;

      &.active {
        background-color: #fcffc8;
      }
    }
  }
</style>