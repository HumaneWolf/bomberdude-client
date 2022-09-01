import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { interval, Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { GamePlayer } from 'src/models/games';

@Component({
  selector: 'app-player',
  template: `
  <div class="player" [style.width]="playerSizePx" [style.height]="playerSizePx" [style.background]="player?.color">
    <span class="player-name">You</span>
    <span><fa-icon [icon]="faHeart"></fa-icon> {{ player?.health }}</span>
  </div>`,
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  faHeart = faHeart;

  @Input() tileSize: number = 100;
  get playerSize() { return this.tileSize * this.relativePlayerSize; }
  get playerSizePx() { return `${this.playerSize}px`; }

  @Input() player?: GamePlayer;

  @Input() map: string[][] = [];
  @Input() mapWidth: number = 0;
  @Input() mapHeight: number = 0;

  @Output() positionChange = new EventEmitter<{x: number, y: number}>();

  movementX = 0;
  movementY = 0;

  relativePlayerSize = 0.8;

  internalTickSub?: Subscription;
  serverTickSub?: Subscription;

  constructor(
    private game: GameService
  ) { }

  ngOnInit(): void {
    const ticksPerSecond = 1000 / 10;

    this.internalTickSub = interval(10).subscribe(_ => {
      if (!this.player) return;
      // Calculate new
      let newX = this.player?.positionX + (this.movementX / ticksPerSecond);
      let newY = this.player?.positionY + (this.movementY / ticksPerSecond);

      // Ensure it's within map boundries
      newX = Math.max(0, Math.min(newX, this.mapWidth - this.relativePlayerSize));
      newY = Math.max(0, Math.min(newY, this.mapHeight - this.relativePlayerSize));

      // If it enters a new tile, check that it's allowed
      if (!this.canEnterTile(newX, newY)) {
        return;
      }
      this.positionChange.emit({x: newX, y: newY});
      
      this.game.setPosition({x: this.player?.positionX, y: this.player?.positionY});
    });

    // this.serverTickSub = interval(15).subscribe(_ => {
    //   if (!this.player) return;
    //   this.game.setPosition({x: this.player?.positionX, y: this.player?.positionY});
    // });
  }

  ngOnDestroy(): void {
    this.internalTickSub?.unsubscribe();
    this.serverTickSub?.unsubscribe();
  }

  private canEnterTile(newX: number, newY: number): boolean {
    if (!this.player) return false;

    // X +
    if (this.movementX > 0 && Math.floor(newX + this.relativePlayerSize) !== Math.floor(this.player?.positionX + this.relativePlayerSize)) {
      let tileType = this.map[Math.floor(newX + this.relativePlayerSize)][Math.floor(this.player?.positionY + this.relativePlayerSize)];
      if (tileType !== 'Clear' && tileType !== 'Explosion') return false;

      tileType = this.map[Math.floor(newX + this.relativePlayerSize)][Math.floor(this.player?.positionY)];
      if (tileType !== 'Clear' && tileType !== 'Explosion') return false;
    }
    // X -
    if (this.movementX < 0 && Math.floor(newX) !== Math.floor(this.player?.positionX)) {
      let tileType = this.map[Math.floor(newX)][Math.floor(this.player?.positionY)];
      if (tileType !== 'Clear' && tileType !== 'Explosion') return false;

      tileType = this.map[Math.floor(newX)][Math.floor(this.player?.positionY + this.relativePlayerSize)];
      if (tileType !== 'Clear' && tileType !== 'Explosion') return false;
    }
    // Y +
    if (this.movementY > 0 && Math.floor(newY + this.relativePlayerSize) !== Math.floor(this.player?.positionY + this.relativePlayerSize)) {
      let tileType = this.map[Math.floor(this.player?.positionX + this.relativePlayerSize)][Math.floor(newY + this.relativePlayerSize)];
      if (tileType !== 'Clear' && tileType !== 'Explosion') return false;

      tileType = this.map[Math.floor(this.player?.positionX)][Math.floor(newY + this.relativePlayerSize)];
      if (tileType !== 'Clear' && tileType !== 'Explosion') return false;
    }
    // Y -
    if (this.movementY < 0 && Math.floor(newY) !== Math.floor(this.player?.positionY)) {
      let tileType = this.map[Math.floor(this.player?.positionX)][Math.floor(newY)];
      if (tileType !== 'Clear' && tileType !== 'Explosion') return false;

      tileType = this.map[Math.floor(this.player?.positionX + this.relativePlayerSize)][Math.floor(newY)];
      if (tileType !== 'Clear' && tileType !== 'Explosion') return false;
    }

    return true;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const moveSpeed = 1.7;
    
    if (event.code === 'ArrowDown' || event.code === 'KeyS') {
      this.movementY = moveSpeed;
    } else if (event.code === 'ArrowUp' || event.code === 'KeyW') {
      this.movementY = -1 * moveSpeed;
    } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      this.movementX = moveSpeed;
    } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      this.movementX = -1 * moveSpeed;

    } else if (event.code === 'Space') {
      this.game.dropBomb();
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    const moveSpeed = 0;

    if (event.code === 'ArrowDown' || event.code === 'KeyS') {
      this.movementY = moveSpeed;
    } else if (event.code === 'ArrowUp' || event.code === 'KeyW') {
      this.movementY = -1 * moveSpeed;
    } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      this.movementX = moveSpeed;
    } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      this.movementX = -1 * moveSpeed;
    }
  }
}
