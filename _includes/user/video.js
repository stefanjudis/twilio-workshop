import {
  html,
  render
} from "https://unpkg.com/htm@2.2.1/preact/standalone.module.js";
import { Video } from "/components/video/video.js";

render(
  html`
    <div>
      <${Video} />
    </div>
  `,
  document.getElementById("root")
);
