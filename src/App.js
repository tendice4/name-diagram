import { useRef } from "react";
import { graphvizSync, wasmFolder } from "@hpcc-js/wasm";
import useInput from "./useInput";

wasmFolder("wasm/dist");

export default function App() {
  const ref = useRef();
  const [name, onChangeName] = useInput("");
  const [engine, onChangeEngine] = useInput("dot");

  const create = async () => {
    const format = "svg";

    const input = `digraph G {
      ${name
        .split("")
        .reduce(
          (acc, cur, idx, arr) =>
            idx < arr.length - 1 &&
            !acc.includes(`  "${cur}" -> "${arr[idx + 1]}"`)
              ? [...acc, `  "${cur}" -> "${arr[idx + 1]}"`]
              : acc,
          []
        )
        .join("\n")}
    }`;
    const gv = await graphvizSync();
    const result = gv.layout(input, format, engine);
    ref.current.innerHTML = result;
  };

  return (
    <div>
      <h1>Name Diagram</h1>
      <input value={name} onChange={onChangeName} />
      <select value={engine} onChange={onChangeEngine}>
        {[
          "circo",
          "dot",
          "fdp",
          "sfdp",
          "neato",
          "osage",
          "patchwork",
          "twopi",
        ].map((engine) => (
          <option key={engine} value={engine}>
            {engine}
          </option>
        ))}
      </select>
      <button onClick={create}>create</button>
      <main ref={ref}></main>
    </div>
  );
}
