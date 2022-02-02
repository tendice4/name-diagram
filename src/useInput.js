import { useState } from "react";

const useInput = (initialState) => {
  const [text, setText] = useState(initialState);
  const onChangeText = (e) => {
    setText(e.target.value);
  };
  return [text, onChangeText];
};

export default useInput;
