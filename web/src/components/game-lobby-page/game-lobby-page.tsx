import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { GameRepository } from '../../services/game-repository';
import { Game } from '../../models/game';
import { getAvatar } from '../../services/avatar-builder';
import { MainGamePage } from '../main-game-page/main-game-page';

@Component({
  tag: 'game-lobby-page',
  styleUrl: 'game-lobby-page.scss',
  shadow: false,
})
export class GameLobbyPage implements ComponentInterface {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;

  @State() gameId: string;
  @State() game: Game | undefined;

  static get route() {
    return `/games/:gameId/lobby`;
  }
  static getRoute(gameId) {
    return `/games/${encodeURIComponent(gameId)}/lobby`;
  }

  static get tagName() {
    return 'game-lobby-page';
  }

  async componentDidLoad() {
    console.log('In lobby for:', this.gameId);
    this.game = await GameRepository.getInstance().getCurrentGame();
    console.log('Got game?', this.game);
  }

  async checkForMorePlayers() {
    this.game = await GameRepository.getInstance().getCurrentGame();
  }

  async startGame() {
    await GameRepository.getInstance().startGame();

    const gameId = (await GameRepository.getInstance().getCurrentGame()).name;
    const playerId = GameRepository.getInstance().getCurrentPlayer().name;

    this.history.push(MainGamePage.getRoute(gameId, playerId), {});
  }

  render() {
    console.log('Players', this.game.players);
    return (
      <Host>
        <h1>{this.gameId}</h1>
        <h3>Waiting for additional players...</h3>
        { this.game ?
          <ul class="player-list">
            {this.game.players.map(player => <li>
              <h4>
                <img class="avatar" src={getAvatar(36, player.name)} />
                {player.name}
              </h4>
            </li>)}
          </ul>
          :
          <img src="../../assets/loader.gif" />
        }

        <button class="btn btn-primary" onClick={() => this.startGame()}>
          Start Game!
        </button>
        <button class="btn" onClick={() => this.checkForMorePlayers()}>
          Check for more players
        </button>
      </Host>
    );
  }

}
