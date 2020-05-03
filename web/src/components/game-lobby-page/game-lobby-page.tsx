import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { GameRepository } from '../../services/game-repository';
import { Game } from '../../models/game';
import { getAvatar } from '../../services/avatar-builder';
import { MainGamePage } from '../main-game-page/main-game-page';
import { GameStatus } from '../../models/game-status';

@Component({
  tag: 'game-lobby-page',
  styleUrl: 'game-lobby-page.scss',
  shadow: false,
})
export class GameLobbyPage implements ComponentInterface {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;

  @State() gameId: string;
  @State() playerId: string;
  @State() game: Game | undefined;

  private _checkTimer: any;

  static get route() {
    return `/games/:gameId/players/:playerId/lobby`;
  }
  static getRoute(gameId, playerId) {
    return `/games/${encodeURIComponent(gameId)}/players/${encodeURIComponent(playerId)}/lobby`;
  }

  static get tagName() {
    return 'game-lobby-page';
  }

  componentWillLoad() {
    console.log('GameLobbyPage');
    this.gameId = this.match.params.gameId;
    this.playerId = this.match.params.playerId;
    GameRepository.getInstance().getOrAddGame(this.gameId)
      .then(game => {
        this.game = game;
      });
  }

  async checkForMorePlayers() {
    this.game = await GameRepository.getInstance().getOrAddGame(this.gameId);
    if(this.game.status === GameStatus.WAITING_FOR_CARDS) {
      this.history.push(MainGamePage.getRoute(this.gameId, this.playerId), {});
    }
  }

  async startGame() {
    await GameRepository.getInstance().startGame();

    this.history.push(MainGamePage.getRoute(this.gameId, this.playerId), {});
  }

  render() {
    console.log('Players', this.game.players);

    clearTimeout(this._checkTimer);
    this._checkTimer = setTimeout(() => this.checkForMorePlayers(), 2000);

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
