import './worker_hacks';

import * as Comlink from 'comlink';

import { ArenaControllerWebGL } from '../classes/ArenaControllerWebGL';

Comlink.expose(ArenaControllerWebGL, self as Comlink.Endpoint);
