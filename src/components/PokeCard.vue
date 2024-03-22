
<script setup lang="ts">
import type { PokemonLong, PokemonShort } from '@/services';
import { computed } from 'vue';
import { ref, type PropType } from 'vue';

export interface Pokemon extends PokemonShort, PokemonLong {};

const props = defineProps({
  pokemon: { type: Object as PropType<Pokemon> },
  index: {type: Number}
})

const emits = defineEmits(['viewPokedex'])

/** Image View Handler */

const viewBack = ref(false);
const isShiny = ref(false);

const imageView = computed(()=>{
  let viewType: 'back' | 'front' = viewBack.value ? 'back' : 'front';
  let pokeType: 'shiny' | 'default' = isShiny.value ? 'shiny' : 'default';
  
  return props.pokemon?.sprites?.[`${viewType}_${pokeType}`]
})

const imagePath = computed(()=>{
  return 'src\\components\\maioumons\\'+ props.index + '.png' 
})

const unknownPath = computed(()=>{
  return 'src\\components\\maioumons\\unknown.png' 
})
</script>

<template>
  <div 
    class="group p-3 flex flex-col my-1 w-full bg-primary-300 rounded shadow-lg shadow-secondary-800"
  >

    <!-- Pokemon Image -->
    <div
    class="
      relative
      aspect-square object-cover
      rounded border border-secondary-500 
      bg-primary-200
      "
    >
      <img 
        :src=imagePath
        @error="$event.target.src='src\\components\\maioumons\\unknown.png' "
        class=" w-full h-full hover:scale-105 transition-transform drop-shadow hover:drop-shadow-lg cursor-pointer"
      />
    </div>

  </div>
</template>
