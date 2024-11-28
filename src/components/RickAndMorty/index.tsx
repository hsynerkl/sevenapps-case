import { FC } from "react";
import MultipleSelect from "./particles/MultipleSelect";
import Characters from "./particles/Characters";
import { useCharacterStore } from "@/store/useCharacterStore";

const RickAndMorty: FC = () => {
  const { isInputFocused } = useCharacterStore();

  return (
    <>
      <MultipleSelect />

      {!isInputFocused && <Characters />}
    </>
  );
};

export default RickAndMorty;
