import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true
})
export class AppHome {
  @State() gameName: string;

  onGameNameKeyPress(event) {
    this.gameName = event.target.value;
  }

  render() {
    return (
      <div class='app-home'>
        <p>
          Enter the name of a game!
        </p>

        <input type="text" placeholder="Game name" name="gameName" onKeyUp={(event) => this.onGameNameKeyPress(event)} />

        <stencil-route-link url={`/games/${this.gameName}`}>
          <button>
            Start or Find Game
          </button>
        </stencil-route-link>

        <stencil-route-link url='/cards'>
          <button>
            Card Directory
          </button>
        </stencil-route-link>
      </div>
    );
  }
}
