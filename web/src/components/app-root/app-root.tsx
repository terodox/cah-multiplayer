import { Component, h } from '@stencil/core';
import { CardDirectoryPage } from '../card-directory-page/card-directory-page';
import { GamePage } from '../game-page/game-page';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  scoped: true,
  shadow: false,
})
export class AppRoot {
  render() {
    return (
      <stencil-router>
        <stencil-route-switch scrollTopOffset={0}>
          <stencil-route url='/' component='app-home' exact={true} />
          <stencil-route url={CardDirectoryPage.route} component={CardDirectoryPage.tagName} />
          <stencil-route url={GamePage.route} component={GamePage.tagName} />
        </stencil-route-switch>
      </stencil-router>
    );
  }
}
