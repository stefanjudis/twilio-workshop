import {
  html,
  Component
} from "https://unpkg.com/htm@2.2.1/preact/standalone.module.js";

import { VideoRoomForm } from "/components/video/video-room-form.js";

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

  async handleSubmit(event) {
    event.preventDefault();
    const localTracks = await window.Twilio.Video.createLocalTracks({
      audio: true,
      video: { width: 640 }
    });

    localTracks.forEach(track => {
      this.localTrack.appendChild(track.attach());
    });

    const room = await window.Twilio.Video.connect(this.state.token, {
      name: event.target.room.value,
      tracks: localTracks
    });

    for (let [, participant] of room.participants) {
      participant.tracks.forEach(track => this.attachRemoteVideoTrack(track));
    }

    room.on("participantConnected", participant => {
      console.log("Connecting participant");
      participant.tracks.forEach(track => {
        this.attachRemoteVideoTrack(track);
      });
    });

    room.on("participantDisconnected", participant => {
      this.leaveRoom();
    });

    this.setState({ room });
  }

  attachRemoteVideoTrack(track) {
    track.on("subscribed", track => {
      console.log("Appending track", track);
      this.remoteTrack.appendChild(track.attach());
    });

    track.on("unsubscribed", track => {
      track.detach().forEach(function(element) {
        console.log("Removing track", track);
        element.remove();
      });
    });
  }

  detachParticipantTracks(participant) {
    const publications = [...participant.tracks.values()];
    publications.forEach(function(publication) {
      if (publication.track) {
        publication.track.detach().forEach(function(element) {
          element.remove();
        });
      }
    });
  }

  leaveRoom() {
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
                onClick=${() => this.leaveRoom()}
                type="button"
              >
                Leave room
              </button>
            `
          : html`
              <${VideoRoomForm}
                identity=${identity}
                handleSubmit=${event => this.handleSubmit(event)}
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
