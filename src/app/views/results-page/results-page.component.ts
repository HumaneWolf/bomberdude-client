import { Component, OnInit } from '@angular/core';
import { LobbyStateService } from '../../services/lobby-state.service';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent implements OnInit {

  constructor(
    private game: GameService,
    private lobby: LobbyStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.game.isConnected || this.lobby.state !== 'CompletionScreen') {
      this.router.navigateByUrl('/');
    }
  }

  playAgain() {
    this.game.playAgain();
  }
}
