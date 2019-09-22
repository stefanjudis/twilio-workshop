import {
  html,
  Component
} from "https://unpkg.com/htm@2.2.1/preact/standalone.module.js";

import { VideoRoomForm } from "/components/video/video-room-form.js";
import { getParticipantsTracks } from "/components/video/video-util.js";

export class Video extends Component {
  constructor() {
    super();

    this.state = {
      itentity: null,
      token: null,
      room: null
    };
  }

  async componentDidMount() {
    const response = await fetch("/.netlify/functions/video-user-token", {
      method: "GET"
    });
    const { identity, token } = await response.json();

    this.setState({ identity, token });
  }

  async joinRoom(event) {
    event.preventDefault();

    const room = await window.Twilio.Video.connect(this.state.token, {
      name: event.target.room.value
    });

    this.attachParticipantTracks(
      getParticipantsTracks(room.localParticipant),
      this.localTrack
    );

    room.participants.forEach(participant => {
      console.log("Already in Room: '" + participant.identity + "'");
      this.handleConnectedParticipant(participant, this.remoteTrack);
    });

    room.on("participantConnected", participant => {
      console.log("Joining: '" + participant.identity + "'");
      this.handleConnectedParticipant(participant, this.remoteTrack);
    });

    room.on("participantDisconnected", participant => {
      console.log(
        `RemoteParticipant ${
          participant.identity
        } left the room. Closing the room`
      );
      this.closeRoom();
    });

    this.setState({ room });
  }

  handleConnectedParticipant(participant, container) {
    participant.tracks.forEach(publication => {
      this.attachPublication(publication, container);
    });
    participant.on("trackPublished", publication => {
      this.attachPublication(publication, container);
    });
  }

  attachPublication(publication, container) {
    if (publication.isSubscribed) {
      container.appendChild(publication.track.attach(), container);
    }
    publication.on("subscribed", function(track) {
      console.log("Subscribed to " + publication.kind + " track");
      container.appendChild(publication.track.attach(), container);
    });
    publication.on("unsubscribed", track => {
      track.detach().forEach(elem => elem.remove());
    });
  }

  attachParticipantTracks(tracks, container) {
    tracks.forEach(function(track) {
      container.appendChild(track.attach());
    });
  }

  detachParticipantTracks(participant) {
    const publications = [...participant.tracks.values()];
    publications.forEach(function(publication) {
      publication.track.detach().forEach(function(element) {
        element.remove();
      });
    });
  }

  closeRoom() {
    console.log("Leaving room");
    const { room } = this.state;
    const participants = [...room.participants.values()];

    this.detachParticipantTracks(room.localParticipant);
    participants.forEach(participant =>
      this.detachParticipantTracks(participant)
    );

    room.disconnect();

    this.setState({
      room: null
    });
  }

  render(props, state) {
    const { identity, room } = state;
    return html`
      <div>
        ${room
          ? html`
              <button
                class="video--closeBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick=${() => this.closeRoom()}
                type="button"
              >
                Leave room
              </button>
            `
          : html`
              <${VideoRoomForm}
                identity=${identity}
                handleSubmit=${event => this.joinRoom(event)}
              />
            `}
        <div
          id="local-media-div"
          class="video--localTrack"
          ref=${c => (this.localTrack = c)}
        ></div>
        <div
          id="remote-media-div"
          class="video--remoteTrack"
          ref=${c => (this.remoteTrack = c)}
        ></div>
      </div>
    `;
  }
}
