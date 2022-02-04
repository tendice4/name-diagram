import { useRef, useState } from "react";
import { graphvizSync, wasmFolder } from "@hpcc-js/wasm";
import useInput from "./useInput";
import transArray from "./transArray";

wasmFolder("wasm/dist");

const engines = [
  "circo",
  "dot",
  "fdp",
  "sfdp",
  "neato",
  "osage",
  "patchwork",
  "twopi",
];

export default function App() {
  const ref = useRef();
  const [name, onChangeName] = useInput("");
  const [active, setActive] = useState("");

  const create = (engine) => async () => {
    const format = "svg";
    setActive(engine);

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
    <>
      <h1>Name Diagram</h1>
      <article>
        <p>
          <input value={name} onChange={onChangeName} maxLength={80} />
        </p>
        <p>
          <div className="button-group">
            {transArray(engines, (arr) => [
              ...arr,
              ...[...new Array((30 - arr.length) % 3)].map(() => ""),
            ]).map((engine) =>
              engine === "" ? (
                <div class="dummy"></div>
              ) : (
                <button
                  key={engine}
                  onClick={create(engine)}
                  className={active === engine ? "dark" : ""}
                >
                  {engine}
                </button>
              )
            )}
          </div>
        </p>
        <footer>
          <div ref={ref}></div>
          {/* <button onClick={() => {}} className="primary">
            share
          </button> */}
        </footer>
      </article>
    </>
  );
}
