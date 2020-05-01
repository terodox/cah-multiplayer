import { Component, ComponentInterface, Host, h, State } from '@stencil/core';
import { BlackCard, CardSourceService } from '../../services/card-source-getter';

export const tagName = 'card-directory-page';
export const route = '/cards';
@Component({
  tag: tagName,
  styleUrl: 'card-directory-page.scss',
  shadow: true,
})
export class CardDirectoryPage implements ComponentInterface {
  cardSourceService: CardSourceService;

  @State() blackCards: Array<BlackCard>;
  @State() whiteCards: Array<string>;

  async componentWillLoad() {
    this.cardSourceService = CardSourceService.getInstance();
    const [
      blackCards,
      whiteCards
    ] = await Promise.all([
      this.cardSourceService.getAllBlackCards(),
      this.cardSourceService.getAllWhiteCards()
    ]);

    this.blackCards = blackCards;
    this.whiteCards = whiteCards;
  }

  render() {
    console.log(this.whiteCards, 'this.whiteCards');
    console.log(this.blackCards, 'this.blackCards');

    if(this.whiteCards && this.blackCards) {
      return (
        <Host>
          <h1>White Cards</h1>
          <ul>
            {this.whiteCards.map(card => <li>{card}</li>)}
          </ul>
          <h1>Black Cards</h1>
          <ul>
            {this.blackCards.map(card => <li>Pick {card.pick} -- {card.text}</li>)}
          </ul>
        </Host>
      );
    } else {
      return (
        <Host>
          Loading...
        </Host>
      )
    }
  }
}
