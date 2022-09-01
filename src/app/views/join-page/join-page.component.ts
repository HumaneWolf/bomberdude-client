import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-join-page',
  templateUrl: './join-page.component.html',
  styleUrls: ['./join-page.component.scss']
})
export class JoinPageComponent implements OnInit {
  name: string = '';
  code: string = '';

  message?: string;

  processing = false;
  get isConnected() { return this.gameService.isConnected; }
  get isConnecting() { return this.gameService.isConnecting; }

  constructor(
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.gameService.isConnected) {
      this.gameService.connect();
    }

    const nameFromLocalStorage = localStorage.getItem('previousName');
    if (nameFromLocalStorage) {
      this.name = nameFromLocalStorage;
    }
  }

  onSubmit() {
    this.processing = true;
    localStorage.setItem('previousName', this.name);

    this.gameService.registerPlayer(this.name)
      ?.then(playerRes => {
        this.name = this.gameService.displayName ?? '';

        this.gameService.joinGame(this.code)?.then(gameRes => {
          if (gameRes.isJoined) {
            this.router.navigateByUrl('/play/lobby');
            return;
          }

          this.message = gameRes.message;
          this.processing = false;
        })
        .catch(_ => {
          this.processing = false;
          // todo: error handling
        });
      })
      .catch(_ => {
        this.processing = false;
        // todo: error handling
      });
  }

  createGame() {
    this.code = this.generateGameCode();
    this.onSubmit();
  }

  private generateGameCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 7; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
