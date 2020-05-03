import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { GameRepository } from '../../services/game-repository';
import { getAvatar } from '../../services/avatar-builder';
import { Game } from '../../models/game';
import { BlackCard, CardSourceService } from '../../services/card-source-getter';

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
  @State() blackCard: BlackCard;
  @State() whiteCard: string;

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
        const cardSourceService = CardSourceService.getInstance();
        return Promise.all([
          cardSourceService.getBlackCard(game.lastBlackCard),
          cardSourceService.getWhiteCard(game.lastTsarSelection)
        ]);
      }).then(([ blackCard, whiteCard ]) => {
        this.blackCard = blackCard;
        this.whiteCard = whiteCard;
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
          this.game && this.blackCard && this.whiteCard  ?
          <div>
            <h3>
              The chosen one is: {this.game.players[this.game.lastWinnerPlayerIndex].name}
            </h3>
            <div class="winning-card">
              <black-card card={this.blackCard as any}></black-card>
              <white-card text={this.whiteCard}></white-card>
            </div>
            <div class="leaderboard">
              <h3>The Leaderboard</h3>
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
          :
          <h3>Loading...</h3>
        }
      </Host>
    );
  }

}
