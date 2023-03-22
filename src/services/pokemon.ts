import axios from '@/plugins/axios';

axios.defaults.baseURL = 'https://pokeapi.co/api/v2';
export default {
  getList(params: PokemonGetListParams = {}) {
    return axios.get<PokemonGetList>('/pokemon', { params });
  },

  getItem(id: number) {
    return axios.get<PokemonLong>(`/pokemon/${id}`);
  }
}

/** TYPE DEFINITIONS */

interface PokemonGetList{
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonShort[],
}
export interface PokemonGetListParams {
  limit?: number;
  offset?: number;
}

export interface PokemonShort {
  name?: string;
  url?: string;
}

export interface PokemonLong {
  id?: number;
  height?: number;
  weight?: number;
}