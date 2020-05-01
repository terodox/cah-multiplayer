import { Component, ComponentInterface, Host, h, Prop } from '@stencil/core';
import { unescapeHtml } from '../../services/unescape-html';
import { BlackCard } from '../../services/card-source-getter';

@Component({
  tag: 'black-card',
  styleUrl: 'black-card.scss',
  shadow: false,
  scoped: true
})
export class BlackCardComponent implements ComponentInterface {
  @Prop() card: BlackCard;

  render() {
    return (
      <Host>
        <div class="card black-card">
          <div class="card-header">
            <div class="card-title h5">{unescapeHtml(this.card.text)}</div>
          </div>
          <div class="card-footer">Pick {this.card.pick}</div>
        </div>
      </Host>
    );
  }

}
