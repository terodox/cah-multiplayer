import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { GameRepository } from '../../services/game-repository';
import { Game } from '../../models/game';
import { CardSourceService, BlackCard } from '../../services/card-source-getter';
import { Player, NONE } from '../../models/player';
import { GameStatus } from '../../models/game-status';
import { RevealWinningCardPage } from '../reveal-winning-card-page/reveal-winning-card-page';

function shuffle(passedArray, isCardTsar) {
  if(!isCardTsar) {
    return passedArray;
  }

  let counter = passedArray.length;

  const array = [
      ...passedArray
  ];
console.log('Preshuffle', array);
  while (counter > 0) {
      let index = Math.floor(Math.random() * counter);

      counter--;

      // Do not use destructuring - performance impact
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }
console.log('After shuffle', array);
  return array;
}

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
  @State() tsarSelectedCard: string;

  private cardSourceService: CardSourceService;
  private _refreshInterval: any;

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

    if(this.game.status === GameStatus.REVEALING_WINNING_CARD) {
      const revealRoute = RevealWinningCardPage.getRoute(this.gameId, this.playerId);
      this.history.replace(revealRoute, {});
    }

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
      shuffle(this.game.players, this.player.isCardTsar)
        .filter(player => player.selectedCard !== NONE)
        .map(async player => await this.cardSourceService.getWhiteCard(player.selectedCard))
    );

    if(this.game.status === GameStatus.WAITING_FOR_TSAR_SELECTION && this.player.isCardTsar) {
      clearInterval(this._refreshInterval);
    }
  }

  async componentWillLoad() {
    console.log(this.match.params);
    this.gameId = this.match.params.gameId;
    this.playerId = this.match.params.playerId;
    await this._refreshGameState();

    this._refreshInterval = setInterval(() => this._refreshGameState(), 2000);
  }

  disconnectedCallback() {
    clearInterval(this._refreshInterval);
  }

  async chooseTsarSelectedCard() {
    if(!this.tsarSelectedCard) {
      window.alert('Choose a card first!');
    }
    const playersAndSelections = await Promise.all(
      this.game.players
        .filter(player => player.selectedCard !== NONE)
        .map(async player => {
          return {
            card: await this.cardSourceService.getWhiteCard(player.selectedCard),
            player,
          };
        })
    );

    const playerAndSelection = playersAndSelections.find(pas => pas.card === this.tsarSelectedCard);
    const tsarSelectedCardId = playerAndSelection.player.selectedCard;

    await GameRepository.getInstance().setTsarSelectedCard({
      gameId: this.gameId,
      selectedCard: tsarSelectedCardId
    });

    const revealRoute = RevealWinningCardPage.getRoute(this.gameId, this.playerId);
    this.history.replace(revealRoute, {});
  }

  async getNewBlackCard() {
    const response = window.confirm('Are you sure you want to get rid of this black card?');
    if(response) {
      await GameRepository.getInstance().getNewBlackCard(this.gameId);
    }
  }

  async mulliganHand() {
    const response = window.confirm('Are you sure you want to get rid of this hand?');
    if(response) {
      await GameRepository.getInstance().mulliganPlayerHand(this.gameId, this.playerId);
    }
  }

  async revealChoices() {
    await GameRepository.getInstance().revealCardTsarChoices();
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

  selectTsarCard(card) {
    this.tsarSelectedCard = card;
  }

  render() {
    console.log('Game status', this.game.status);
    if(this.game) {
      const cardTsarName = (this.game.players.find(player => player.isCardTsar)).name;
      return (<Host>
        {this.player.name === cardTsarName ?
          <h1 class="you-are-the-card-tsar">YOU ARE THE CARD TSAR!</h1>
        :
          <h1>Card Tsar is <span class="card-tsar">{cardTsarName}</span></h1>
        }
        <div class="others-cards-container">
          <black-card card={this.blackCard as any}></black-card>
          <div class="other-people-selections">
            {
              this.game.status === GameStatus.WAITING_FOR_CARDS ?
                <white-card text={`Waiting for player selections.
                Waiting on ${this.game.players.length - this.otherPeopleSelections.length - 1} players`}></white-card>
              :
              this.otherPeopleSelections.map(card => card ?
                <white-card
                  text={card}
                  onClick={() => this.selectTsarCard(card)}
                  selected={this.tsarSelectedCard === card}
                ></white-card> : '')
            }
          </div>
        </div>
        { this.player.isCardTsar ?
          this.game.status === GameStatus.WAITING_FOR_CARDS ?
            [
              <button class="btn btn-primary" onClick={() => this.revealChoices()}>
                Reveal cards
              </button>,
              <button class="btn" onClick={() => this.getNewBlackCard()}>
                FUCK THIS BLACK CARD! GIMME A NEW ONE!
              </button>
            ]
            :
            <button class="btn btn-primary" onClick={() => this.chooseTsarSelectedCard()}>
              Choose selected card
            </button>
          :
          this.game.status === GameStatus.WAITING_FOR_CARDS ?
            <div class="player-card-container">
              <h2>Your Cards</h2>
              <div class="player-cards">
                {this.playerCards.map(whiteCard => <white-card
                  text={whiteCard}
                  onClick={() => this.selectCard(whiteCard)}
                  selected={this.selectedCard === whiteCard}
                ></white-card>)}
              </div>
              <button class="btn" onClick={() => this.mulliganHand()} >This hand is trash. Get a new one now!</button>
            </div>
            : <h2>Waiting for card tsar to choose...</h2>
        }
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
