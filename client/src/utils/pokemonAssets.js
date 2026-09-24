/**
 * pokemonAssets.js
 * Centralized helpers for Pokémon sprite paths across the client.
 */

export function formatSpeciesId(speciesId) {
  return String(speciesId || 1).padStart(3, '0');
}

/**
 * Returns the URL path for an animated Pokémon GIF sprite.
 *
 * @param {number|string} speciesId - Pokedex species ID (1 to 151)
 * @param {object} options
 * @param {boolean} [options.isShiny=false] - Whether to load the shiny variant
 * @param {boolean} [options.isBack=false] - Whether to load the back sprite (for battle)
 * @returns {string} - URL path e.g. /assets/pokemon/animated/front/normal/001.gif
 */
export function getPokemonAnimatedSprite(speciesId, { isShiny = false, isBack = false } = {}) {
  const fmtId = formatSpeciesId(speciesId);
  const direction = isBack ? 'back' : 'front';
  const variant = isShiny ? 'shiny' : 'normal';
  return `/assets/pokemon/animated/${direction}/${variant}/${fmtId}.gif`;
}

/**
 * Returns the URL path for a static overworld Pokémon sprite.
 *
 * @param {number|string} speciesId - Pokedex species ID
 * @returns {string} - URL path e.g. /assets/pokemon/overworld/001.png
 */
export function getPokemonOverworldSprite(speciesId) {
  const fmtId = formatSpeciesId(speciesId);
  return `/assets/pokemon/overworld/${fmtId}.png`;
}
