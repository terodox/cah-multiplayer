import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { GameRepository } from '../../services/game-repository';
import { Game } from '../../models/game';

@Component({
  tag: 'main-game-page',
  styleUrl: 'main-game-page.scss',
  shadow: false,
})
export class MainGamePage implements ComponentInterface {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;

  @State() gameId: string;
  @State() game: Game | undefined;

  static get route() {
    return `/games/:gameId/playing`;
  }
  static getRoute(gameId) {
    return `/games/${encodeURIComponent(gameId)}/playing`;
  }

  static get tagName() {
    return 'main-game-page';
  }

  async componentDidRender() {
    this.game = await GameRepository.getInstance().getOrAddGame(this.gameId);
  }

  async startGame() {
    await GameRepository.getInstance()
      .startGame(this.gameId);

    //this.history.push();
  }

  render() {
    return (
      <Host>
        <h1>{this.gameId}</h1>
        <h3>Waiting for additional players...</h3>
        <ul class="player-list">
          {this.game.players.forEach(player => {
            <li>{player.name}</li>
          })}
        </ul>

        <button class="btn primary-btn" onClick={() => this.startGame()}>
          Start Game!
        </button>
      </Host>
    );
  }

}
