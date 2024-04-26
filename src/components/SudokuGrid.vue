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