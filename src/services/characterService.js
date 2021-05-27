import characters from '@/configs/characters';

const getCharacter = (name) => {
  return characters.find((item) => item.name === name);
}


const characterService = {
  getCharacter
}

export default characterService;
