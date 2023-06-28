<script setup lang="ts">

import { pokemon as pokeFetch, type Pokemon } from '@/services';
import { ref, computed, toRef, watch, Transition } from 'vue';
import PokedexInfo from './PokedexInfo.vue';

const props = defineProps({
  powerPokedex: Boolean, 
  pokemonId: {
    type: [Number]
  }
})

const emits = defineEmits([
  'next',
  'previous',
  'update:pokemonId',
  'update:powerPokedex',
]);

/** Pokemon Logic */
const oldPokeId = ref(1);
const open = ref(false);
const loading = ref(false);
const pokemon = ref<Pokemon | null>(null);
/**
 * Fetch details of thee pokemon
 */
async function fetchPokemon() {
  if (!props.pokemonId) return;
  
  loading.value = true;
  try {
    let pokemonDetails = (await pokeFetch.getItem(props.pokemonId)).data;
    pokemon.value = pokemonDetails;
    oldPokeId.value = props.pokemonId;
  } catch {
    alert('An Error appeared! Try again.');
    emits('update:pokemonId', oldPokeId.value);
  }
  loading.value = false;
}

watch(
  toRef(props, 'pokemonId'), 
  fetchPokemon, 
  { immediate: true }
);


watch(toRef(props, 'powerPokedex'), (value)=>{
  if (value) {
    setTimeout(()=>{
      console.log('powering on...')
      open.value = true;
    }, 500);
  }
}, { immediate: true });

watch(open, (value)=>{
  if (!value) {
    setTimeout(()=>{
      emits('update:powerPokedex', false);
    }, 500);
  }
});


/** Main Screen Logic */

const arrowControls = [
  // Up
  {
    keyCode: 'ArrowUp',
    htmlCode: '',
    class: 'col-start-2',
    onClick: ()=>{},
  },
  // Left
  {
    keyCode: 'ArrowLeft',
    htmlCode: '&#9664;',
    class: 'row-start-2 col-start-1',
    onClick: ()=>emits('update:pokemonId', (props.pokemonId || 0) - 1),
  },
  // Right
  {
    keyCode: 'ArrowRight',
    htmlCode: '&#9654;',
    class: 'row-start-2 col-start-3',
    onClick: ()=>emits('update:pokemonId', (props.pokemonId || 0) + 1),
  },
  // Down
  {
    keyCode: 'ArrowDown',
    htmlCode: '',
    class: 'row-start-3 cols-start-2',
    onClick: ()=>{},
  },
];

const isShiny = ref(false);


/** Sub  Screen Logic */

type InfoKey = 'base' | 'stats' | 'moves' | 'abilities' | 'held_items';

const infoControls: { name: string; key:InfoKey, keyCode?: string }[] = [
  {
    name: 'Basic',
    key: 'base',
    keyCode: '1',

  },
  {
    name: 'Stats',
    key: 'stats',
    keyCode: '2',
  },
  {
    name: 'Moves',
    key: 'moves',
    keyCode: '3',
  },
  {
    name: 'Ability',
    key: 'abilities',
    keyCode: '4',
  },  
  {
    name: 'Items',
    key: 'held_items',
    keyCode: '5',
  },
  {
    name: '-',
    key: 'base',
  },
  {
    name: '-',
    key: 'base',
  },
  {
    name: '-',
    key: 'base',
  },
  {
    name: '-',
    key: 'base',
  },
  {
    name: '-',
    key: 'base',
  },
];


const currentInfo = ref<InfoKey>('base');
const currentInfoI = ref(0);
const currentInfoMaxPage = computed(()=>{
  const key = currentInfo.value as keyof typeof pokemon.value;
  const info = pokemon.value?.[key]
  if (info === undefined || !Array.isArray(info)) 
    return 1;
  return Math.floor((info as [])?.length/6);
})

const infoPagintionControl = [
  { name: 'Page Down',  keyCode: '-', key: '-', onClick: ()=>changeInfoPage(currentInfoI.value - 1)  },
  { name: 'Page Up', keyCode: '=', key: '+', onClick: ()=>changeInfoPage(currentInfoI.value + 1)  },
]


function changeInfo(key: InfoKey) {
  currentInfoI.value = 0;
  currentInfo.value = key;
}

function changeInfoPage(page: number) {
  if (page < 0 || page >= currentInfoMaxPage.value) 
    return;

  currentInfoI.value = page;
}


/** POKEDEX KEYPRESS CONTROL */
function handleKeypress(e: KeyboardEvent) {
  const controls = [
    ...infoControls
      .map(ctrl=>({...ctrl, onClick: ()=>changeInfo(ctrl.key)})), 
    ...arrowControls,
    ...infoPagintionControl,
    // Toggle shiny
    { keyCode: ' ', onClick: ()=>isShiny.value = !isShiny.value },
    { keyCode: 'Escape', onClick: ()=>open.value = false },
  ];

  const control = controls.find(ctrl=>ctrl.keyCode === e.key);

  if (control?.onClick) {
    control.onClick()
  }
}


</script>

<template>
  <Transition
    enter-active-class="duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="powerPokedex" 
      class="
        z-40
        fixed top-0 left-0
        h-screen w-screen
        backdrop-blur bg-secondary-900/95
        overflow-auto
        md:flex items-center md:justify-center
        p-2
      "
      tabindex="0"
      @keydown="handleKeypress"
    >
  
      <div
        class="
          p-1 md:pb-5
          absolute top-3 md:top-5 right-3 md:right-10
          flex justify-center gap-x-3
          text-lg md:text-4xl text-primary-400
          bg-accent-600
          border-4 border-black
          z-50
        "
      >
        <p class="text-center font-pokemon">Pokedex</p>
        <p class="text-center md:text-end mt-4 md:mt-6 font-pixel text-xs md:text-xl">Viewer</p>
      </div>
      <div 
        class="
          w-full max-w-[950px] md:scale-95 2xl:scale-150
          flex flex-col md:flex-row md:justify-center md:items-center 
        
        "
      >
        <!-- Main Pokedex Screen -->
        <div class="relative">
          <img 
            src="@/assets/pokedex/pokedex-main.png" 
            alt="Main Pokedex"
            width="503"
            height="663"
            class="w-full drop-shadow-md"
          />
          <!-- Signal Light -->
          <div 
            v-if="loading"
            class="
              bg-blue-800 
              h-[7%] aspect-square rounded-full
              absolute top-[9%] left-[12%]
              animate-ping
            "
          ></div>
          <!-- Main Screen -->
          <div 
            class="
              absolute top-[39.5%] left-[22%] 
              w-[45.5%] h-[23%] 
              bg-primary-300/80
              overflow-hidden
              flex justify-center items-center
              transition-all
            "
            :class="open ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
          >
            <!-- Pokemon Sprite -->
            <img
              v-if="loading"
              width="200px" 
              height="200px" 
              src="@/assets/pokedex/pokeball.png" 
              alt="PokeBall"
              class="
                mt-4
                absolute
                w-1/2 aspect-square 
                animate-bounce
              "
            />
            <img 
              v-else-if="pokemon"
              :src="
                isShiny 
                  ? pokemon?.sprites?.front_shiny 
                  : pokemon?.sprites?.front_default"
              alt="Pokemon Sprite"
              height="300px"
              width="300px"
              class="
                w-[100%] aspect-square
                drop-shadow-md
                absolute -top-[26%]
              " 
            />
          </div>
          <!-- Pokemon Name -->
          <div 
            class="
              p-0.5
              w-[38%] 
              absolute top-[65.4%] left-[28%]
              z-20
              text-center text-accent-900 uppercase
              font-pixel font-bold
            "
          >
            {{ loading ? 'Loading Pokemon...' : pokemon?.name }}
          </div>
          <!-- Arrow Controls -->
          <div 
            class="
              p-1
              grid grid-cols-3 grid-rows-3
              w-[22%]  aspect-square
              absolute top-[75.4%] left-[61%]
              z-20
            "
          >
            <!-- Up -->
            <button 
              v-for="(arrow, arrowI) in arrowControls"
              :key="arrowI"
              :disabled="loading || !open"
              :class="arrow.class"
              class="
                cursor-pointer
                flex items-center justify-center
                text-center text-lg uppercase
                text-accent-500 hover:text-accent-200 disabled:text-gray-500
                font-pixel font-bold
                transition-all
              "
              v-html="arrow.htmlCode"
              @click="arrow.onClick"
            ></button>
          </div>
          <!-- Shiny Toggle -->
          <button
            :disabled="loading || !open"
            class="
              p-1
              cursor-pointer
              font-pixel flex items-center justify-center
              h-[10%] w-[26.5%] 
              absolute top-[82%] left-[26%]
              z-20
              hover:bg-primary-200 active:bg-primary-500 disabled:bg-secondary-800
              text-accent-700 hover:text-accent-500 disabled:text-transparent 
              transition-all
              text-xs md:text-base
            "
            :class="isShiny ? 'bg-primary-200' : ''"
            @click="isShiny = !isShiny"
          >
            <p>TOGGLE SHINY</p>
          </button>
          <!-- Shutdown -->
          <button 
            class="
              cursor-pointer
              p-1
              w-[6%] aspect-square
              absolute top-[77.3%] left-[9.1%]
              hover:fill-black 
              hover:bg-accent-500
              transition-colors
            "
            :class="open ? 'bg-primary-200 fill-accent-900' : 'fill-accent-500'"
            @click="open = !open, fetchPokemon()"
          >
            <svg 
              id="Capa_1" 
              xmlns="http://www.w3.org/2000/svg" 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 325.214 325.214" 
              xml:space="preserve"
              class="h-full w-full"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M288.777,93.565c-15.313-23.641-36.837-42.476-62.243-54.472c-1.616-0.763-3.109-1.134-4.564-1.134 c-1.969,0-8.392,0.833-8.392,11.541v17.75c0,8.998,5.479,13.113,7.159,14.16c32.613,20.33,52.083,55.317,52.083,93.59 c0,60.772-49.442,110.214-110.214,110.214S52.393,235.772,52.393,175c0-38.872,19.942-74.144,53.346-94.353 c4.475-2.707,6.839-7.426,6.839-13.647V49c0-7.959-5.077-10.783-9.424-10.783c-1.714,0-3.542,0.422-5.144,1.188 C72.781,51.471,51.42,70.305,36.237,93.872C20.638,118.084,12.393,146.137,12.393,175c0,82.828,67.386,150.214,150.214,150.214 S312.821,257.828,312.821,175C312.821,146.008,304.507,117.848,288.777,93.565z"></path> <path d="M152.579,117h21c5.514,0,10-4.486,10-10V10c0-5.514-4.486-10-10-10h-21c-5.514,0-10,4.486-10,10v97 C142.579,112.514,147.064,117,152.579,117z"></path> </g> </g>
            </svg>
          </button>
        </div>
        <!-- Sub Pokedex Screen -->
        <div class="relative -mt-20 md:mt-0">
          <img  
            src="@/assets/pokedex/pokedex-sub.png" 
            alt="Main Pokedex"
            width="503"
            height="663"
            class="w-full drop-shadow-md"
          />
  
          
          <!-- Sub Screen -->
          <div
            class="
              p-1 
              absolute top-[33.1%] left-[6.5%] 
              w-[68%] h-[13.1%] 
              bg-emerald-200/50
              text-xs md:text-sm
              font-pixel
              transition-all ease-in-out
              overflow-hidden
            "
            :class="open ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
          >
            
            <div v-if="loading" class="h-full w-full flex items-center justify-center">
              <p class="text-lg font-bold">Loading Data...</p>
            </div>
            <div v-else-if="pokemon" class="h-full w-full">
              <!-- Basic Tab -->
              <div v-if="currentInfo === 'base'">
                <div class="border border-black p-1">
                  <PokedexInfo
                    label="Type"
                    :value="
                      pokemon?.types
                        ?.map(type=>type.type.name)
                        ?.join(', ')
                    "
                  ></PokedexInfo>
                </div>
    
                <div class="mt-3 grid grid-cols-2 gap-10">
                  <div>
                    <PokedexInfo
                      label="Height"
                      :value="pokemon.height"
                    ></PokedexInfo>
                  </div>
    
                  <div>
                    <PokedexInfo
                      label="Weight"
                      :value="pokemon.weight"
                    ></PokedexInfo>
                  </div>
    
                </div>
              </div>
              <!-- Stats Tab -->
              <div v-if="currentInfo === 'stats'">
                <div class="mt-2 grid grid-cols-2 gap-x-5 md:gap-y-2">
                  <PokedexInfo
                    v-for="stat in pokemon?.stats"
                    :key="stat.stat?.name"
                    :label="stat.stat?.name"
                    :value="stat.base_stat"
                  ></PokedexInfo>
                </div>
              </div>
              <!-- Moves Tab -->
              <div v-if="currentInfo === 'moves'" class="flex flex-col">
                <div class="grid grid-cols-2 gap-x-5 h-full">
                  <div
                    v-for="(move, moveI) in pokemon.moves.slice(1*(currentInfoI*6), 6*(1+currentInfoI))"
                    :key="move.move.name"
                  >
                    <PokedexInfo
                      :label="`${moveI + 1 + (currentInfoI*6)}`"
                      :value="move.move.name"
                    ></PokedexInfo>
                  </div>
                </div>
                <p class="mt-auto text-xs text-end">{{ currentInfoI + 1  }}/ {{  currentInfoMaxPage  }}</p>
              </div>
              <!-- Abilities Tab -->
              <div v-if="currentInfo === 'abilities'" class="flex flex-col h-full">
                <div v-if="pokemon.abilities.length === 0" class="text-lg h-full w-full flex items-center justify-center">
                  N/A
                </div>
                <div class="mt-1 grid grid-cols-2 gap-x-5">
                  <div
                    v-for="abl in pokemon.abilities.slice(1*(currentInfoI*6), 6*(1+currentInfoI))"
                    :key="abl.ability.name"
                  >
                    <PokedexInfo
                      :label="`Slot ${abl.slot}`"
                      :value="abl.ability.name"
                    ></PokedexInfo>
                  </div>
                </div>
                <p class="mt-auto text-xs text-end">{{ currentInfoI + 1  }}/ {{  currentInfoMaxPage  }}</p>
              </div>
              <!-- Abilities Tab -->
              <div v-if="currentInfo === 'held_items'" class="flex flex-col h-full">
                <div v-if="pokemon.held_items.length === 0" class="text-lg h-full w-full flex items-center justify-center">
                  N/A
                </div>
                <div class="mt-1 grid grid-cols-2 gap-x-5">
                  <div
                    v-for="(item, itemI) in pokemon.held_items.slice(1*(currentInfoI*6), 6*(1+currentInfoI))"
                    :key="item.item.name"
                  >
                    <PokedexInfo
                      :label="`#${itemI + 1}`"
                      :value="item.item.name"
                    ></PokedexInfo>
                  </div>
                </div>
                <p class="mt-auto text-xs text-end">{{ currentInfoI + 1  }}/ {{  currentInfoMaxPage  }}</p>
              </div>
            </div>
          </div>
          
          <!-- Info Controls -->
          <div
            class="
              absolute top-[52.6%] left-[8.6%]
              h-[11.6%] w-[63.1%]
              grid grid-cols-5 grid-rows-2 gap-2
            "
            :class="open ? 'opacity-100' : 'opacity-0'"
          >
            <button 
              v-for="(ctrl, ctrlI) in infoControls" 
              :key="ctrl.key"
              :disabled="loading || !open"
              class="
                cursor-pointer 
                bg-blue-400 hover:bg-blue-500 disabled:bg-blue-700
                text-center font-pixel
              "
              :class="
                ctrl.key === currentInfo && ctrl.name !== '-'
                  ? 'bg-blue-100'
                  : ''
              "
              @click="changeInfo(ctrl.key)"
            >
              <p class="hidden md:block text-xs text-accent-500">{{ ctrlI+1 }}</p>
              <p class="text-xs font-bold">{{  ctrl.name  }}</p>
            </button>
          </div>
  
          <!-- Info Control Pagination -->
          <div
            class="
              absolute top-[72.3%] left-[6.4%]
              h-[5.1%] w-[19.8%]
              grid grid-cols-2 gap-2
              text-3xl font-pixel text-center items-center
            "
            :class="open ? 'opacity-100' : 'opacity-0'"
          >
            <!-- Page down -->
            <button
              v-for="pagination in infoPagintionControl"
              :key="pagination.name"
              :disabled="currentInfoMaxPage <= 1 || loading || !open"
              class="
                h-full overflow-hidden
                disabled:bg-gray-500 hover:bg-whiteactive:bg-gray-300
              "
              @click="pagination.onClick"
            >
              {{  pagination.key  }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>