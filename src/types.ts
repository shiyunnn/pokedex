export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  fallbackSprite: string;
}

export interface VotePokemon extends Pick<Pokemon, 'id' | 'name' | 'sprite'> {}
