import { Component, ComponentInterface, Host, h, Prop } from '@stencil/core';
import { unescapeHtml } from '../../services/unescape-html';

@Component({
  tag: 'white-card',
  styleUrl: 'white-card.scss',
  shadow: false
})
export class WhiteCard implements ComponentInterface {
  @Prop() text: string;
  @Prop() selected: boolean;

  render() {
    let selectedStyle = '';
    if(this.selected) {
      selectedStyle = 'selected';
    }

    return (
      <Host class={`card ${selectedStyle}`}>
        <div class="card-header">
          <div class="card-title h5" innerHTML={unescapeHtml(this.text)}></div>
        </div>
      </Host>
    );
  }

}
