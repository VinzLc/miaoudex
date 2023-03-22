
<script setup lang="ts">

</script>

<template>
  <button 
    :class="`
      mt-5 
      py-1 px-3
      rounded 
      outline-primary-200 hover:outline disabled:outline-0
      transition-[outline-width] ease-in-out duration-75
      border border-primary-500 disabled:border-primary-200
      text-white bg-primary-500 disabled:bg-primary-200
    `"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>
