<template>
  <div class="number-picker">
    <div
        v-for="nr in [1,2,3,4,5,6,7,8,9]"
        :class="{'number': true, 'active': selectedNumber === nr}" @click="onClick(nr)">
      {{ nr }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: 'NumberPicker',

  data () {
    return {
      selectedNumber: 0
    }
  },

  methods: {
    onClick(value: number) {
      if (this.selectedNumber === value) {
        this.selectedNumber = 0;
      } else {
        this.selectedNumber = value;
      }

      this.$emit('selectNumber', {number: this.selectedNumber})
    }
  }
});
</script>

<style lang="scss" scoped>
.number-picker {
  width: 50vw;
  height: 5.5555vw;
  margin-top: 2.5vw;
  background-color: #454545;
  border: 1px solid #454545;
  display: grid;
  grid-gap: 1px;
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: repeat(9, 1fr);

  @media (orientation: landscape) {
    width: 50vh;
    height: 5.5555vh;
    margin-top: 2.5vh;
  }
}

.number {
  &:before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    font-size: 0;
    letter-spacing: 0;
    line-height: 0;
  }

  background-color: white;
  font-family: 'Roboto', sans-serif;
  font-size: 2.5vh;
  font-weight: 300;
  text-align: center;
  vertical-align: middle;

  &.active {
    background-color: #fcffc8;
  }

  @media (orientation: portrait) {
    font-size: 2.5vw;
  }
}
</style>