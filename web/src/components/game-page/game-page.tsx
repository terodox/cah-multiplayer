import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';

@Component({
  tag: 'game-page',
  styleUrl: 'game-page.scss',
  shadow: true,
})
export class GamePage implements ComponentInterface {
  @State() gameId: string;
  @Prop() match: MatchResults;

  static get route() {
    return '/game/:gameId';
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
        {this.gameId}
      </Host>
    );
  }

}
