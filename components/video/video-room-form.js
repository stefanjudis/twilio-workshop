import { html } from "https://unpkg.com/htm@2.2.1/preact/standalone.module.js";

export function VideoRoomForm(props) {
  const { handleSubmit, identity } = props;

  return html`
    <div>
      <div class="w-full max-w-md">
        <form
          class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          action="post"
          onSubmit=${event => handleSubmit(event)}
        >
          <h1 class="font-bold text-xl mb-2">Hello ${identity}! 👋</h1>
          <p>Enter your the name of the 1:1 video room!</p>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="room-name"
            >
              Room Name
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="room"
              type="text"
              placeholder="room name"
              value="Twilio workshop"
              required
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Enter!
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
