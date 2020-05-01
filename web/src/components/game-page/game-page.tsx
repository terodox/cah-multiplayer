import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';

export const tagName = 'game-page';
export const route = '/game/:gameId';
@Component({
  tag: tagName,
  styleUrl: 'game-page.scss',
  shadow: true,
})
export class GamePage implements ComponentInterface {
  @State() gameId: string;
  @Prop() match: MatchResults;

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
