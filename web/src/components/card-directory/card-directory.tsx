import { Component, ComponentInterface, Host, h, State } from '@stencil/core';
import { CardSourceService } from '../../services/card-source-getter';

@Component({
  tag: 'card-directory',
  styleUrl: 'card-directory.scss',
  shadow: true,
})
export class CardDirectory implements ComponentInterface {
  cardSourceService: CardSourceService;

  @State() blackCards;
  @State() whiteCards;

  async componentWillLoad() {
    this.cardSourceService = CardSourceService.getInstance();
    [
      this.blackCards,
      this.whiteCards
    ] = await Promise.resolve([
      this.cardSourceService.getAllBlackCards(),
      this.cardSourceService.getAllWhiteCards()
    ]);
  }

  render() {
    return (
      <Host>
        <h1>White Cards</h1>
        <ul>
          {this.whiteCards? this.whiteCards.forEach(card => <li>${card.text}</li>) : 'Loading...'}
        </ul>
        <h1>Black Cards</h1>
        <ul>
          {this.blackCards? this.blackCards.forEach(card => <li>${card.text}</li>) : 'Loading...'}
        </ul>
      </Host>
    );
  }
}
