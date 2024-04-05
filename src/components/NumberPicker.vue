<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['selectNumber']);

const props = defineProps(['input'])
const selectedNumber = ref("-");

const numberClick = (newVal: string) => {
  selectedNumber.value = selectedNumber.value === newVal ? '-' : newVal;
  emit('selectNumber', selectedNumber.value)
}

const countRegex = (val: string) => new RegExp(/[^${val}]/g);
</script>

<template>
  <div class="number-picker">
    <div
        v-for="nr in '123456789'"
        :key="`number-picker-${nr}`"
        :class="{'number': true, 'active': selectedNumber === nr, 'completed': (input.split(nr).length-1) === 9}" @click="numberClick(nr)"
      >
      {{ nr }}
    </div>
  </div>
</template>

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

  background-color: rgb(150, 150, 150);
  color: white;
  font-family: 'Roboto', sans-serif;
  font-size: 2.5vh;
  font-weight: 300;
  text-align: center;
  vertical-align: middle;
  user-select: none;

  @media (orientation: portrait) {
    font-size: 2.5vw;
  }

  &:hover {
    cursor: pointer;
  }

  &.completed {
    color: #acacac;
    background-color: #e0e0e0;
    font-style: italic;
  }

  &.active {
    color: #fff;
    background-color: #313131;
  }
}
</style>