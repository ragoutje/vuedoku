<script lang="ts" setup>
import { ref } from 'vue';

export type ValuesObjectType = Array<string>;

export type LabelsObjectType = {
    [key: string]: string;
};

/* Interface declarations */
const { selected, values, labels } = defineProps<{selected: number, values: ValuesObjectType, labels: LabelsObjectType}>()
const emit = defineEmits(['change-selected']);

/* Internal state */
const current = ref(selected);

/* Methods */
const prevHandler = (): void => {
    current.value--;
    emit('change-selected', current.value);
}

const nextHandler = (): void => {
    current.value++
    emit('change-selected', current.value);
}
</script>

<template>
    <div class="horizontal-select">
        <div class="horizontal-select__button">
            <span v-if="current !== 0" class="material-symbols-outlined" @click="prevHandler">chevron_left</span>
        </div>
        <div class="horizontal-select__label">{{ labels[values[current]] }}</div>
        <div class="horizontal-select__button">
            <span
v-if="current !== Object.keys(values).length - 1" class="material-symbols-outlined"
                @click="nextHandler">chevron_right</span>
        </div>
    </div>
</template>