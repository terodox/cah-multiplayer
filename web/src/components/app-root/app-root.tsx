import { Component, h } from '@stencil/core';
import { tagName as cardDirectoryPageTagName, route as cardDirectoryPageRoute } from '../card-directory-page/card-directory-page';
import { tagName as gamePageTagName, route as gamePageRoute } from '../game-page/game-page';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true
})
export class AppRoot {
  render() {
    return (
      <stencil-router>
        <stencil-route-switch scrollTopOffset={0}>
          <stencil-route url='/' component='app-home' exact={true} />
          <stencil-route url={cardDirectoryPageRoute} component={cardDirectoryPageTagName} />
          <stencil-route url={gamePageRoute} component={gamePageTagName} />
        </stencil-route-switch>
      </stencil-router>
    );
  }
}
