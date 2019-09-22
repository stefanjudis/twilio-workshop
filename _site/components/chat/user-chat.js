import {
  html,
  Component
} from "https://unpkg.com/htm@2.2.1/preact/standalone.module.js";

export class Chat extends Component {
  constructor() {
    super();

    this.state = {
      channel: null
    };
  }

  async handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/.netlify/functions/chat-user-token", {
        method: "POST",
        body: JSON.stringify({
          email: event.target["email"].value
        })
      });
      const { token } = await response.json();

      this.createClient(token);
    } catch (e) {
      console.error(e);
    }
  }

  async createClient(token) {
    // the Twilio library was brought in via a good old script :)
    const chatClient = await window.Twilio.Chat.Client.create(token);
    // TODO handle expire case
    // add logic for expired token here. :)
    // https://www.twilio.com/docs/chat/access-token-lifecycle

    const channel = await chatClient.getChannelByUniqueName("workshop-channel");
    if (channel.state.status !== "joined") {
      await channel.join();
    }

    this.setState({ channel });
  }

  render(props, state) {
    const { channel } = state;

    return html`
      ${channel
        ? html`
            Use the next component 'chatWindow'
          `
        : html`
            <div>
              <div class="w-full max-w-md">
                <form
                  class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                  action="post"
                  onSubmit=${event => this.handleSubmit(event)}
                >
                  <h1 class="font-bold text-xl mb-2">Chat example</h1>
                  <p>Enter your chat name to enter the chat!</p>
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="chat-name"
                    >
                      user name
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="user name"
                      value="stefanjudis@gmail.com"
                      required
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <button
                      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          `}
    `;
  }
}
