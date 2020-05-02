import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Game } from '../models/game';
import { Player } from '../models/player';

const SAFETY = Symbol('Private Ctor');
export class GameRepository {
  private _baseUrl: string;
  private _currentPlayer: Player;

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

  async getOrAddGame(gameId: string): Promise<Game> {
      const response = await axios.get(`${this._baseUrl}/games/${encodeURIComponent(gameId)}`);
      return new Game(response.data);
  }

  async getOrAddPlayer(gameId: string, playerName: string): Promise<Player> {
    const response = await axios.get(`${this._baseUrl}/games/${encodeURIComponent(gameId)}/players/${encodeURIComponent(playerName)}`);
    this._currentPlayer = new Player(response.data);
    return this._currentPlayer;
  }

  getCurrentPlayer() {
    if(this._currentPlayer) {
      return this._currentPlayer;
    }
    throw new Error('Player has not been set yet');
  }

  async startGame(gameId) {
    await axios.patch(`${this._baseUrl}/games/${encodeURIComponent(gameId)}`);
  }
}
