import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { Player } from '../../models/player';
import { GameRepository } from '../../services/game-repository';
import { GameLobbyPage } from '../game-lobby-page/game-lobby-page';

@Component({
  tag: 'player-page',
  styleUrl: 'player-page.scss',
  shadow: false,
})
export class PlayerPage implements ComponentInterface {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;

  @State() gameId: string;
  @State() player: Player | undefined;

  private playerNameInputElement: HTMLInputElement;

  static get route() {
    return `/games/:gameId/players`;
  }
  static getRoute(gameId) {
    return `/games/${encodeURIComponent(gameId)}/players`;
  }

  static get tagName() {
    return 'player-page';
  }

  componentWillLoad() {
    this.gameId = this.match.params.gameId;
  }

  addPlayerAndEnterGame() {
    console.log('Player name:', this.playerNameInputElement.value);
    GameRepository.getInstance()
      .getOrAddPlayer(this.gameId, this.playerNameInputElement.value)
      .then((player) => {
        console.log('Player added:', player);
        const lobbyRoute = GameLobbyPage.getRoute(this.gameId);
        console.log('Navigating to:', lobbyRoute);
        this.history.push(lobbyRoute, {});
      });
  }

  render() {
    return (
      <Host>
        <h1>Joining game <span class="game-name">{this.gameId}</span></h1>
        <h3>What would you like your name to be?</h3>
        <div class="form-group">
          <label class="form-label">Player Name</label>
          <input
            class="form-input"
            id="player-name"
            max-length="30"
            placeholder="Player Name"
            ref={(el) => this.playerNameInputElement = el as HTMLInputElement}
            required
            type="text"
            />
          <button class="btn btn-primary" onClick={() => this.addPlayerAndEnterGame()}>
            Enter the game!
          </button>
        </div>
      </Host>
    );
  }

}
