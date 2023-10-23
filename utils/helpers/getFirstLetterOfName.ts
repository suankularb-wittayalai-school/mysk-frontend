import { THAI_STARTING_VOWELS } from "@/utils/helpers/startsWithThaiVowel";

export default function getFirstLetterOfName(name: string) {
  return name
    .split("")
    .find((letter) => !THAI_STARTING_VOWELS.includes(letter));
}
