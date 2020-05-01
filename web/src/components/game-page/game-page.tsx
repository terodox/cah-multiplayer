import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';

@Component({
  tag: 'game-page',
  styleUrl: 'game-page.scss',
  shadow: false,
})
export class GamePage implements ComponentInterface {
  @State() gameId: string;
  @Prop() match: MatchResults;

  static get route() {
    return '/games/:gameId';
  }

  static get tagName() {
    return 'game-page';
  }

  componentWillLoad() {
    this.gameId = this.match.params.gameId;
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
