import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { GameRepository } from '../../services/game-repository';
import { getAvatar } from '../../services/avatar-builder';
import { Game } from '../../models/game';

@Component({
  tag: 'reveal-winning-card-page',
  styleUrl: 'reveal-winning-card-page.scss',
  shadow: false,
})
export class RevealWinningCardPage implements ComponentInterface {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;

  @State() gameId: string;
  @State() game: Game;

  static get route() {
    return '/games/:gameId/reveal-winning-card';
  }

  static getRoute(gameId) {
    return RevealWinningCardPage.route.replace(':gameId', encodeURIComponent(gameId));
  }

  static get tagName() {
    return 'reveal-winning-card-page';
  }

  componentWillLoad() {
    this.gameId = this.match.params.gameId;
    GameRepository.getInstance()
      .getOrAddGame(this.gameId)
      .then(game => {
        this.game = game;
      });
  }

  render() {
    /* Display
        - black card
        - winning white card
        - winning player name
        - Leader board
    */
    return (
      <Host>
        {
          !this.game ?
          <h1>Loading...</h1>
          :
          <div>
            <h3>
              The chosen one is: {this.game.players[this.game.lastWinnerPlayerIndex].name}
            </h3>
            <div class="winning-card">
              <black-card></black-card>
              <white-card></white-card>
            </div>
            <div class="leaderboard">
            <ul class="player-list">
              {this.game.players.map(player => <li>
                <h4>
                  <img class="avatar" src={getAvatar(36, player.name)} />
                  {player.name}: {player.points}
                </h4>
              </li>)}
            </ul>
            </div>
          </div>
        }
      </Host>
    );
  }

}
