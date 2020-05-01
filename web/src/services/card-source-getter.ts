import axios from 'axios';
import axiosRetry from 'axios-retry';

declare global {
  interface Window {
    appConfig: any;
  }
}

export interface BlackCard {
  text: string;
  pick: number;
}

const SAFETY = Symbol('Private Ctor');
export class CardSourceService {
  private baseUrl: string;

  private _cardDataPromise: Promise<any>;

  constructor(baseUrl, validation) {
    if (validation !== SAFETY) {
      throw new Error('Private constructor. Please use get instance');
    }

    this.baseUrl = baseUrl;

    axiosRetry(axios);
  }

  static getInstance() {
    return new CardSourceService(window.appConfig.apiBaseUrl, SAFETY);
  }

  async getBlackCard(cardId): Promise<BlackCard> {
    const allCards = await this._safelyGetAllCards();
    return allCards.blackCards[cardId];
  }

  async getAllBlackCards(): Promise<Array<BlackCard>> {
    const allCards = await this._safelyGetAllCards();
    return allCards.data.blackCards;
  }

  async getWhiteCard(cardId): Promise<string> {
    const allCards = await this._safelyGetAllCards();
    return allCards.data.whiteCards[cardId];
  }

  async getAllWhiteCards(): Promise<Array<string>> {
    const allCards = await this._safelyGetAllCards();
    return allCards.data.whiteCards;
  }

  private async _safelyGetAllCards() {
    if(this._cardDataPromise) {
      return this._cardDataPromise;
    }
    return this._getAllCards();
  }

  private async _getAllCards() {
    this._cardDataPromise = axios.get(`${this.baseUrl}/cards`, {
      responseType: 'json'
    });

    this._cardDataPromise.catch(error => {
      console.log(error);
      this._cardDataPromise = undefined;
    });

    return this._cardDataPromise;
  }
}
