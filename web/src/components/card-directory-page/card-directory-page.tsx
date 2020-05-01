import { Component, ComponentInterface, Host, h, State } from '@stencil/core';
import { BlackCard, CardSourceService } from '../../services/card-source-getter';

@Component({
  tag: 'card-directory-page',
  styleUrl: 'card-directory-page.scss',
  scoped: true,
  shadow: false,
})
export class CardDirectoryPage implements ComponentInterface {
  cardSourceService: CardSourceService;

  @State() blackCards: Array<BlackCard>;
  @State() whiteCards: Array<string>;

  static get route() {
    return '/cards';
  }

  static get tagName() {
    return 'card-directory-page';
  }

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
          <div class="card-container">
            {this.whiteCards.map(cardText => <white-card text={cardText}></white-card>)}
          </div>
          <h1>Black Cards</h1>
          <div class="card-container">
            {this.blackCards.map((card: any) => <black-card card={card}></black-card>)}
          </div>
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
