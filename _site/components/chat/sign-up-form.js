import {
  html,
  Component
} from "https://unpkg.com/htm@2.2.1/preact/standalone.module.js";

export class UserChat extends Component {
  handleSubmit(event) {
    event.preventDefault();
    console.log(event);
  }

  render(props, state) {
    console.log("fdsf");
    return html`
      <div>
        <div class="w-full max-w-md">
          <form
            class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit=${event => console.log(event)}
          >
            <h1 class="font-bold text-xl mb-2">Chat example</h1>
            <p>Enter your chat name to enter the chat!</p>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="chat-name"
              >
                chat name
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="chat-name"
                type="text"
                placeholder="chat name"
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }
}
