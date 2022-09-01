import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ISubscription } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { GamePlayer, LobbyPlayer } from 'src/models/games';
import { ActiveBoard, ActiveBomb } from '../../../models/board';
import { GameService } from '../../services/game.service';
import { LobbyStateService } from '../../services/lobby-state.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit, OnDestroy, AfterViewInit {
  private boardSub?: ISubscription<ActiveBoard>;

  winner?: LobbyPlayer;

  _map: string[][] = [];
  map = new BehaviorSubject<string[][]>([]);

  myPlayer?: GamePlayer;

  _players: GamePlayer[] = [];
  players = new BehaviorSubject<GamePlayer[]>([]);
  _livingPlayers: GamePlayer[] = [];
  livingPlayers = new BehaviorSubject<GamePlayer[]>([]);

  _bombs: ActiveBomb[] = [];
  bombs = new BehaviorSubject<ActiveBomb[]>([]);

  @ViewChild('gameBoard') gameBoardRef?: ElementRef;

  mapWidth: number = 0;
  mapHeight: number = 0;
  boardWidth: number = -1;
  boardHeight: number = -1;
  tileSize: number = 100;

  get boardWidthPx() { return this.boardWidth > 0 ? `${this.boardWidth}px` : null; }
  get boardHeightPx() { return this.boardHeight > 0 ? `${this.boardHeight}px` : null; }

  viewInitialized = false;
  mapInitialized = false;
  mapCalculated = false;

  constructor(
    private lobby: LobbyStateService,
    private game: GameService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.game.isConnected || this.lobby.state !== 'InProgress') {
      this.router.navigateByUrl('/');
    }

    this.boardSub = this.game.getActiveBoardStream()?.subscribe({
      next: value => {
        this.winner = value.winner;

        this._map = value.map;
        this.map.next(this._map);

        this.mapWidth = this._map.length;
        this.mapHeight = this._map[0].length;

        this.mapInitialized = true;
        this.calculateMapSize();

        this._bombs = value.bombs;
        this.bombs.next(this._bombs);

        this._players = value.players;
        this.players.next(this._players);

        this._livingPlayers = this._players.filter(x => x.isAlive && x.characterId !== this.lobby.characterId);
        this.livingPlayers.next(this._livingPlayers);

        const me = this._players.find(x => x.characterId === this.lobby.characterId);
        if (this.myPlayer) {
          this.myPlayer.health = me?.health ?? 0;
          this.myPlayer.isAlive = me?.isAlive ?? false;
        } else {
          this.myPlayer = me;
        }
      },
      complete: () => {},
      error: err => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.boardSub?.dispose();
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.calculateMapSize();
  }

  calculateMapSize() {
    if (!this.mapInitialized || !this.viewInitialized) return;
    if (this.mapCalculated) return;

    const height = this.gameBoardRef?.nativeElement.clientHeight;
    const width = this.gameBoardRef?.nativeElement.clientWidth;
    const heightBasedSize = Math.floor(height / this.mapHeight);
    const widthBasedSize = Math.floor(width / this.mapWidth);
    this.tileSize = Math.min(heightBasedSize, widthBasedSize);

    this.boardHeight = this.mapHeight * this.tileSize;
    this.boardWidth = this.mapWidth * this.tileSize;

    this.mapCalculated = true;
  }

  range(length: number): number[] {
    return [...new Array(length).keys()]
  }

  xPosition(x: number) {
    return `${x * this.tileSize}px`;
  }

  yPosition(y: number) {
    return `${y * this.tileSize}px`;
  }

  playerMoveTo(x: number, y: number) {
    if (this.myPlayer) {
      this.myPlayer.positionX = x;
      this.myPlayer.positionY = y;
    }
  }
}
