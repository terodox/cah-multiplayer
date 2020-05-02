import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { GameRepository } from '../../services/game-repository';
import { Game } from '../../models/game';
import { CardSourceService, BlackCard } from '../../services/card-source-getter';
import { Player, NONE } from '../../models/player';
import { GameStatus } from '../../models/game-status';

@Component({
  tag: 'main-game-page',
  styleUrl: 'main-game-page.scss',
  shadow: false,
})
export class MainGamePage implements ComponentInterface {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;

  @State() blackCard: BlackCard;
  @State() game: Game | undefined;
  @State() player: Player | undefined;
  @State() gameId: string;
  @State() playerId: string;
  @State() playerCards: Array<string>;
  @State() selectedCard: string;
  @State() otherPeopleSelections: Array<string> = [];

  private cardSourceService: CardSourceService;

  static get route() {
    return `/games/:gameId/players/:playerId/playing`;
  }

  static getRoute(gameId, playerId) {
    return `/games/${encodeURIComponent(gameId)}/players/${encodeURIComponent(playerId)}/playing`;
  }

  static get tagName() {
    return 'main-game-page';
  }

  constructor() {
    this.cardSourceService = CardSourceService.getInstance();
  }

  private async _refreshGameState() {
    this.game = await GameRepository.getInstance().getOrAddGame(this.gameId);
    this.player = this.game.players.find(player => player.name === this.playerId);
    this.blackCard = await this.cardSourceService.getBlackCard(this.game.currentBlackCard);
    console.log('Player cards:', this.player.cards);
    this.playerCards = await Promise.all(
      this.player.cards.map(async cardId => await this.cardSourceService.getWhiteCard(cardId))
    );
    console.log('this.playerCards', this.playerCards);
    this.selectedCard = await this.cardSourceService.getWhiteCard(this.player.selectedCard);
    console.log(this.player.selectedCard, this.selectedCard);

    this.otherPeopleSelections = await Promise.all(
      this.game.players
        .filter(player => player.selectedCard !== NONE)
        .map(async player => await this.cardSourceService.getWhiteCard(player.selectedCard))
    );
  }

  async componentWillLoad() {
    console.log(this.match.params);
    this.gameId = this.match.params.gameId;
    this.playerId = this.match.params.playerId;
    await this._refreshGameState();
  }

  async selectCard(card) {
    this.selectedCard = card;
    const cardIndex = this.playerCards.indexOf(card);
    const cardId = this.player.cards[cardIndex];
    await GameRepository.getInstance().setSelectedPlayerCard({
      gameId: this.gameId,
      playerId: this.playerId,
      selectedCard: cardId
    });

    console.log('Selected card updated:', cardId);
    await this._refreshGameState();
  }

  render() {
    if(this.game) {
      return (<Host>
        <h1>{this.gameId}</h1>
        <div class="others-cards-container">
          <black-card card={this.blackCard as any}></black-card>
          <div class="other-people-selections">
            {
              this.game.status === GameStatus.WAITING_FOR_CARDS ?
                <white-card text={`Waiting for player selections. Total submitted: ${this.otherPeopleSelections.length}`}></white-card>
              :
              this.otherPeopleSelections.map(card => card ?
                <white-card text={card}></white-card> : '')
            }
          </div>
        </div>
        <div class="player-card-container">
          <h2>Your Cards</h2>
          <div class="player-cards">
            {this.playerCards.map(whiteCard => <white-card
              text={whiteCard}
              onClick={() => this.selectCard(whiteCard)}
              selected={this.selectedCard === whiteCard}
            ></white-card>)}
          </div>
        </div>
      </Host>);
    } else {
      return (
        <Host>
          <h1>{this.gameId}</h1>
          <h3>Loading...</h3>
        </Host>
      );
    }

  }

}
