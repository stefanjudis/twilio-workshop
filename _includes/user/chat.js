import {
  html,
  render
} from "https://unpkg.com/htm@2.2.1/preact/standalone.module.js";
import { Chat } from "/components/chat/chat.js";

render(
  html`
    <div>
      <${Chat} />
    </div>
  `,
  document.getElementById("root")
);
