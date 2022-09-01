import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LobbyPlayer, LobbyState, PlayerJoinResponse } from '../../models/games';

@Injectable({
  providedIn: 'root'
})
export class LobbyStateService {
  // todo: Cleanup when needed.

  inLobby = false;
  state: string = 'Disconnected';

  characterId?: string;

  joinCode?: string;
  maxPlayers?: number;
  players: LobbyPlayer[] = [];

  constructor(
    private router: Router,
  ) { }

  processJoin(response: PlayerJoinResponse) {
    this.inLobby = true;
    this.characterId = response.characterId;
    this.joinCode = response.joinCode;
    this.players = response.players ?? [];
    this.maxPlayers = response.maxPlayers;
  }

  processStateChange(response: LobbyState) {
    if (this.state !== response.state && response.state === 'Waiting') {
      this.router.navigateByUrl('/play/lobby');
    }
    if (this.state !== response.state && response.state === 'InProgress') {
      this.router.navigateByUrl('/play/game');
    }
    if (this.state !== response.state && response.state === 'CompletionScreen') {
      this.router.navigateByUrl('/play/results');
    }

    this.state = response.state;
    this.players = response.players;
  }
}
