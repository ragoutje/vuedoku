<script lang="ts">
import {defineComponent} from "vue";
import Cell from './Cell.vue';

export default defineComponent({
  name: 'Grid',
  
  components: {
    Cell
  },

  props: {
    grid: {
      type: Object,
      required: true,
    },
    selectedNumber: {
      type: String,
      default: undefined,
    },
  },

  methods: {
    handleClick(index: number) {
      this.$emit('cellClicked', index);
    }
  }
});
</script>

<template>
  <div class="grid">
    <Cell
        v-for="(value, i) in grid.puzzle"
        :key="`cell-${i}`"
        :index="i"
        :puzzleValue="value"
        :solutionValue="grid.solution[i]"
        :inputValue="grid.input[i]"
        :selectedNumber="selectedNumber"
        @clicked="handleClick"
    />
  </div>
</template>

<style lang="scss" scoped>
.grid {
  width: 50vw;
  height: 50vw;
  background-color: #454545;
  border: 1px solid #454545;
  display: grid;
  grid-gap: 1px;
  grid-template-rows: repeat(9, 1fr);
  grid-template-columns: repeat(9, 1fr);

  & .cell:nth-of-type(n+4):nth-of-type(-n+6),
  & .cell:nth-of-type(n+13):nth-of-type(-n+15),
  & .cell:nth-of-type(n+22):nth-of-type(-n+24),
  & .cell:nth-of-type(n+28):nth-of-type(-n+30),
  & .cell:nth-of-type(n+37):nth-of-type(-n+39),
  & .cell:nth-of-type(n+46):nth-of-type(-n+48),
  & .cell:nth-of-type(n+34):nth-of-type(-n+36),
  & .cell:nth-of-type(n+43):nth-of-type(-n+45),
  & .cell:nth-of-type(n+52):nth-of-type(-n+54),
  & .cell:nth-of-type(n+58):nth-of-type(-n+60),
  & .cell:nth-of-type(n+67):nth-of-type(-n+69),
  & .cell:nth-of-type(n+76):nth-of-type(-n+78) {
    background-color: #eee;
  }

  @media (orientation: landscape) {
    width: 50vh;
    height: 50vh;
  }
}
</style>