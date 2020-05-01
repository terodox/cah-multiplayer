import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Game } from '../models/game';

const SAFETY = Symbol('Private Ctor');
export class GameRepository {
  private _baseUrl: string;

  constructor(baseUrl, validation) {
    if (validation !== SAFETY) {
      throw new Error('Private constructor. Please use get instance');
    }

    this._baseUrl = baseUrl;

    axiosRetry(axios);
  }

  static getInstance() {
    return new GameRepository(window.appConfig.apiBaseUrl, SAFETY);
  }

  async getGame(gameId: string) {
      const response = await axios.get(`${this._baseUrl}/game/${encodeURIComponent(gameId)}`);
      return new Game(response.data);
  }

  async startGame(gameId) {
    await axios.patch(`${this._baseUrl}/game/${encodeURIComponent(gameId)}`);
  }
}
