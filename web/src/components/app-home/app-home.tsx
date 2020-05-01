import { Component, State, h, Prop } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true
})
export class AppHome {
  @Prop() history: RouterHistory;
  @State() gameName: string;

  findGame() {
    this.history.push(`game/${this.gameName}`, {});
  }

  render() {
    return (
      <div class='app-home'>
        <p>
          Enter the name of a game!
        </p>

        <input type="text" placeholder="Game name" name="gameName" value={this.gameName} />

        <button onClick={this.findGame}>
          Start or Find Game
        </button>

        <stencil-route-link url='/cards'>
          <button>
            Card Directory
          </button>
        </stencil-route-link>
      </div>
    );
  }
}
