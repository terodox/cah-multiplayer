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
let _instance;
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
    if(!_instance) {
      _instance = new CardSourceService(window.appConfig.apiBaseUrl, SAFETY);
    }
    return _instance;
  }

  async getBlackCard(cardId: number): Promise<BlackCard> {
    const allCards = await this._safelyGetAllCards();
console.log('Total black cards:', allCards);
    return allCards.blackCards[cardId];
  }

  async getAllBlackCards(): Promise<Array<BlackCard>> {
    const allCards = await this._safelyGetAllCards();
    return allCards.blackCards;
  }

  async getWhiteCard(cardId: number): Promise<string> {
    const allCards = await this._safelyGetAllCards();
    return allCards.whiteCards[cardId];
  }

  async getAllWhiteCards(): Promise<Array<string>> {
    const allCards = await this._safelyGetAllCards();
    return allCards.whiteCards;
  }

  private async _safelyGetAllCards() {
    if(this._cardDataPromise) {
      return this._cardDataPromise.then(response => response.data);
    }
    return this._getAllCards().then(response => response.data);
  }

  private async _getAllCards() {
    this._cardDataPromise = axios.get(`${this.baseUrl}/cards`, {
      responseType: 'json'
    });

    this._cardDataPromise.catch(error => {
      console.log(error);
      this._cardDataPromise = undefined;
      throw error;
    });

    return this._cardDataPromise;
  }
}
