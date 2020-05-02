import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import { MatchResults, RouterHistory } from '@stencil/router';
import { GameRepository } from '../../services/game-repository';
import { Game } from '../../models/game';
import { CardSourceService, BlackCard } from '../../services/card-source-getter';
import { Player } from '../../models/player';

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

  async componentWillLoad() {
    console.log(this.match.params);
    this.gameId = this.match.params.gameId;
    this.playerId = this.match.params.playerId;
    this.game = await GameRepository.getInstance().getOrAddGame(this.gameId);
    this.player = this.game.players.find(player => player.name === this.playerId);
    this.blackCard = await this.cardSourceService.getBlackCard(this.game.currentBlackCard);
    console.log('Player cards:', this.player.cards);
    this.playerCards = await Promise.all(
      this.player.cards.map(async cardId => await this.cardSourceService.getWhiteCard(cardId))
    );
    console.log('this.playerCards', this.playerCards);
  }

  render() {
    if(this.game) {
      return (<Host>
        <h1>{this.gameId}</h1>
        <div class="current-black-card">
          <black-card card={this.blackCard as any}></black-card>
        </div>
        <div class="player-cards">
          {this.playerCards.map(whiteCard => <white-card text={whiteCard}></white-card>)}
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
