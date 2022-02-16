import { useState } from "react";
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
  const [name, onChangeName] = useInput("");
  const [active, setActive] = useState("");
  const [result, setResult] = useState("");

  const create = (engine) => async () => {
    const format = "svg";
    setActive(engine);

    const input = `digraph G {
      graph[bgcolor="#00000000"];
      ${name
        .replace(/["\s]/g, "")
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
    const svg = gv.layout(input, format, engine);
    setResult(`data:image/svg+xml,${encodeURIComponent(svg)}`);
  };

  return (
    <>
      <h1>Name Diagram</h1>
      <article>
        <p>
          <label>
            Name
            <input value={name} onChange={onChangeName} maxLength={500} />
          </label>
        </p>
        <p>
          <label>
            Engine
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
          </label>
        </p>
        <footer>
          {result.length > 0 ? <img src={result} /> : null}
          {/* <button onClick={() => {}} className="primary">
            share
          </button> */}
        </footer>
      </article>
    </>
  );
}
