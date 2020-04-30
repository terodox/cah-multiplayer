import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

const SAFETY = Symbol('Private Ctor');
export class CardSourceService {
  private _axios: AxiosInstance;
  private _cardDataPromise: Promise<any>;

  constructor(baseURL, validation) {
    if (validation !== SAFETY) {
      throw new Error('Private constructor. Please use get instance');
    }
    this._axios = axios.create({ baseURL });
    axiosRetry(this._axios);
  }

  static getInstance() {
    
  }

  async getBlackCard(cardId) {
    const allCards = await this._safelyGetAllCards();
    return allCards.blackCards[cardId];
  }

  async getAllBlackCards() {
    const allCards = await this._safelyGetAllCards();
    return allCards.blackCards;
  }

  async getWhiteCard(cardId) {
    const allCards = await this._safelyGetAllCards();
    return allCards.whiteCards[cardId];
  }

  async getAllWhiteCards() {
    const allCards = await this._safelyGetAllCards();
    return allCards.whiteCards;
  }

  private async _safelyGetAllCards() {
    if(this._cardDataPromise) {
      return this._cardDataPromise;
    }
    return this._getAllCards();
  }

  private async _getAllCards() {
    this._cardDataPromise = axios.get('/cards');

    try {
      await this._cardDataPromise;
    } catch (error) {
      this._cardDataPromise = undefined;
    }

    return this._cardDataPromise;
  }
}
