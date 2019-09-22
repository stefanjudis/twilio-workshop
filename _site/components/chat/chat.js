import {
  html,
  Component
} from "https://unpkg.com/htm@2.2.1/preact/standalone.module.js";

import { ChatSignUpForm } from "/components/chat/chat-signup-form.js";
import { ChatWindow } from "/components/chat/chat-window.js";

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
            <${ChatWindow} channel=${channel} />
          `
        : html`
            <${ChatSignUpForm}
              handleSubmit=${event => this.handleSubmit(event)}
            />
          `}
    `;
  }
}
