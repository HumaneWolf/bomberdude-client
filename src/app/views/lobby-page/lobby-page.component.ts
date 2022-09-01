import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { LobbyStateService } from '../../services/lobby-state.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent implements OnInit {
  faEye = faEye; faEyeSlash = faEyeSlash;

  processing = false;

  showJoinCode = true;
  get joinCode() { return this.lobby.joinCode; }

  playerColumns = ['color', 'name', 'wins'];
  get players() { return this.lobby.players; }
  get maxPlayers() { return this.lobby.maxPlayers; }

  constructor(
    private game: GameService,
    private lobby: LobbyStateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.lobby.inLobby || !this.game.isConnected) {
      this.router.navigateByUrl('/');
    }

    const storageShowJoin = localStorage.getItem('showJoinCode');
    if (storageShowJoin !== null) {
      this.showJoinCode = JSON.parse(storageShowJoin);
    }
  }

  toggleShowJoinCode() {
    this.showJoinCode = !this.showJoinCode;

    localStorage.setItem('showJoinCode', JSON.stringify(this.showJoinCode));
  }

  startGame() {
    this.processing = true;
    this.game.startGame()?.then(_ => {
      this.router.navigateByUrl('/play/game');
    });
  }
}
