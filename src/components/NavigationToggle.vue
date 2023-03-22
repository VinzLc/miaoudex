<script setup lang="ts">
import type { PropType } from 'vue';
  export type ModelValue = 'pagination' | 'increment'
  const props = defineProps({
    modelValue: { 
      type: String as PropType<ModelValue>, 
      required: true,
    }
  });

  const emit = defineEmits(['update:modelValue'])

  function updateModelValue() {
    const value = props.modelValue === 'increment'
      ? 'pagination'
      : 'increment';
    
    emit('update:modelValue', value);
  }


</script>

<template>
  <div 
    class="
      p-3
      select-none
      cursor-pointer 
      flex justify-between 
      rounded border border-secondary-500 hover:border-primary-500
      transition-colors
    "
    @click="updateModelValue"
  >
    <h4
      class="transition" 
      :class="{ 
        'text-secondary-500': props.modelValue === 'increment', 
        'text-primary-500': props.modelValue === 'pagination',
      }"
    >
      Paginate
    </h4>
    
    <div 
      class="relative mx-2 w-12 h-6 border rounded-full"
      >
      <div 
        class="absolute transition-[right] bg-primary-500 h-full aspect-square rounded-full"
        :class="props.modelValue === 'pagination' ? 'right-0' : 'right-6'"
      ></div>
    </div>    
  </div>
</template>
