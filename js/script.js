import { playMusic } from "./music.js";

const wait = (delay = 0) => new Promise((resolve) => setTimeout(resolve, delay));

const setVisible = (elementOrSelector, visible) =>
  ((typeof elementOrSelector === "string"
    ? document.querySelector(elementOrSelector)
    : elementOrSelector
  ).style.display = visible ? "flex" : "none");

setVisible(".container", false);
setVisible("#loading", true);

document.addEventListener("DOMContentLoaded", () =>
  wait(1000).then(() => {
    setVisible(".container", true);
    setVisible("#loading", false);
    document.querySelector(".not-loaded").classList.remove("not-loaded");
    playMusic();
  })
);
