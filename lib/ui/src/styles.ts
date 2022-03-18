import { css } from "lit"

export const button = css`
  button {
    color: #111;
    line-height: 0;
    padding: 0.4rem 1rem;
    border: 3px outset #bababa;
    border-radius: 1rem;
    background: radial-gradient(circle at 100%, #ccc 10%, #b30e08 75%);
    transition: all 0.1s;
  }
  button:hover {
    cursor: pointer;
    box-shadow: 0 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.25);
  }
  button:active {
    border-style: inset;
    transform: translate(0.2rem, 0.2rem);
  }
  button:disabled {
    cursor: not-allowed;
    border-style: groove;
    background: #669;
    opacity: 0.6;
    color: #ccc;
  }
`
