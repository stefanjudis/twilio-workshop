import {
  html,
  Component
} from "https://unpkg.com/htm@2.2.1/preact/standalone.module.js";

export class ChatWindow extends Component {
  constructor(props) {
    super();
    this.state = {
      messages: [],
      users: []
    };
  }

  componentDidMount() {
    Promise.all([
      this.props.channel.getMessages(),
      this.props.channel.getMembers()
    ]).then(async ([messages, members]) => {
      const users = await Promise.all(members.map(member => member.getUser()));

      users.forEach(user => {
        user.on("updated", ({ user }) => {
          console.log("updated");
          const otherUsers = users.filter(
            oldUser => oldUser.state.identity !== user.state.identity
          );
          this.setState({
            users: [...otherUsers, user]
          });
        });
      });

      this.setState({
        messages: messages.items,
        users
      });
    });

    this.props.channel.on("messageAdded", message => {
      this.setState({
        messages: this.state.messages.concat([message])
      });

      setTimeout(() => (this.scroll.scrollTop = this.scroll.scrollHeight), 0);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const msg = form.message.value;
    this.props.channel.sendMessage(msg);
    form.message.value = "";
  }

  render(props, state) {
    const { messages, users } = state;
    return html`
      <div class="w-full max-w-md">
        <form
          class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          action="post"
          onSubmit=${event => this.handleSubmit(event)}
        >
          <ul class="chat--messageContainer" ref=${c => (this.scroll = c)}>
            ${messages.map(message => {
              return html`
                <li>
                  ${message.author}: ${message.body}
                </li>
              `;
            })}
          </ul>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="chat-name"
            >
              Message
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="message"
              type="text"
              placeholder="message"
              value=""
              required
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Send
            </button>
          </div>
        </form>
        ${users.map(
          user =>
            html`
              <span
                class="inline-block ${user.state.online
                  ? "bg-green-200"
                  : "bg-gray-200"} mt-2 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                >${user.state.identity}</span
              >
            `
        )}
      </div>
    `;
  }
}
