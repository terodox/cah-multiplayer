import { Component, ComponentInterface, Host, h } from '@stencil/core';
import { CardSourceService } from '../../services/card-source-getter';

@Component({
  tag: 'card-directory',
  styleUrl: 'card-directory.scss',
  shadow: true,
})
export class CardDirectory implements ComponentInterface {

  componentWillLoad() {
    CardSourceService.getInstance();
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
