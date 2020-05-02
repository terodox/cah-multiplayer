import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { GameRepository } from '../../services/game-repository';
import { PlayerPage } from '../player-page/player-page';

@Component({
  tag: 'game-page',
  styleUrl: 'game-page.scss',
  shadow: false,
})
export class GamePage implements ComponentInterface {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;

  @State() gameId: string;

  static get route() {
    return '/games/:gameId';
  }

  static get tagName() {
    return 'game-page';
  }

  componentWillLoad() {
    this.gameId = this.match.params.gameId;
    GameRepository.getInstance()
      .getOrAddGame(this.gameId)
      .then(game => {
        console.log('Game found!', game);
        const playerRoute = PlayerPage.getRoute(game.name);
        console.log('Navigating to:', playerRoute);
        this.history.push(playerRoute, {});
      });
  }

  render() {
    return (
      <Host>
        <div class="hero-image">
          <img src="../../assets/cow-abduction.svg"></img>
        </div>
        <div>
          <h1>Searching for <span class="game-name">{this.gameId}</span></h1>
        </div>
      </Host>
    );
  }

}
