import { Component, Input, OnInit } from '@angular/core';
import { faBomb } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bomb',
  template: `
  <div class="bomb-container" [style.width]="frameSizePx" [style.height]="frameSizePx">
    <fa-icon class="bomb-icon" [icon]="faBomb" [styles]="{'width': bombSizePx, 'height': bombSizePx}"></fa-icon>
  </div>
  `,
  styleUrls: ['./bomb.component.scss']
})
export class BombComponent {
  faBomb = faBomb;

  @Input() tileSize: number = 100;
  get bombSize() { return this.tileSize * this.relativePlayerSize; }
  get bombSizePx() { return `${this.bombSize}px`; }
  get frameSizePx() { return `${this.tileSize}px`; }

  relativePlayerSize = 0.5;
}
