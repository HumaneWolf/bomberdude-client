import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faBurst } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-map-tile',
  template: `
    <div class="tile" [style.width]="tileSizePx" [style.height]="tileSizePx"
      [class.clear-tile]="type === 'Clear'"
      [class.wall-tile]="type === 'Wall'"
      [class.unbreakable-tile]="type === 'Unbreakable'"
      [class.explosion-tile]="type === 'Explosion'"
    >
      <fa-icon *ngIf="type === 'Explosion'" [icon]="faBurst"></fa-icon>
    </div>
  `,
  styleUrls: ['./map-tile.component.scss']
})
export class MapTileComponent implements OnInit, OnDestroy {
  faBurst = faBurst;

  @Input() tileSize: number = 100;
  get tileSizePx() { return `${this.tileSize}px`; }

  @Input() x: number = 0;
  @Input() y: number = 0;

  @Input() mapUpdates?: BehaviorSubject<string[][]>;

  type: string = 'Clear';

  mapUpdateSub?: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.mapUpdateSub = this.mapUpdates?.subscribe(res => {
      const newType = res[this.x][this.y];
      if (this.type !== newType) this.type = newType;
    });
  }

  ngOnDestroy(): void {
    this.mapUpdateSub?.unsubscribe();
  }
}
