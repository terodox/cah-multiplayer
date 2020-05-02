import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Game } from '../models/game';
import { Player } from '../models/player';

const SAFETY = Symbol('Private Ctor');
let _instance;
export class GameRepository {
  private _baseUrl: string;
  private _currentPlayer: Player;
  private _currentGameId: string;

  constructor(baseUrl, validation) {
    if (validation !== SAFETY) {
      throw new Error('Private constructor. Please use get instance');
    }

    this._baseUrl = baseUrl;

    axiosRetry(axios);
  }

  static getInstance() {
    if(!_instance) {
      _instance = new GameRepository(window.appConfig.apiBaseUrl, SAFETY);
    }
    return _instance;
  }

  async getOrAddGame(gameId: string): Promise<Game> {
    if(!gameId) {
      throw new Error('Cannot fetch game for falsy gameId');
    }
    const response = await axios.get(`${this._baseUrl}/games/${encodeURIComponent(gameId)}`);
    this._currentGameId = gameId;
    console.log('Current game id:', this._currentGameId);
    return new Game(response.data);
  }

  async getCurrentGame(): Promise<Game> {
    console.log('Getting current game:', this._currentGameId);
    return this.getOrAddGame(this._currentGameId);
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

  async startGame() {
    await axios.patch(`${this._baseUrl}/games/${encodeURIComponent(this._currentGameId)}`, {
      status: 'STARTING_GAME'
    }, {
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
