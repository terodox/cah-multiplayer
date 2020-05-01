import { Component, ComponentInterface, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'find-game',
  styleUrl: 'find-game.css',
  shadow: true,
})
export class FindGame implements ComponentInterface {
  @Prop() gameName: string;

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
