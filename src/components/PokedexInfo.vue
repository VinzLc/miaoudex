
<script setup lang="ts">
defineProps({
  label: String,
  value: [String, Number],
})
</script>

<template>
  <p  class="uppercase inline-flex justify-start items-center gap-2">
    <span class="flex-grow truncate text-xs font-light">
      {{ label }}:
    </span>
    <span class="flex-shrink text-xs truncate font-bold text-accent-900">
      {{ value }}
    </span>
  </p>
</template>
