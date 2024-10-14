import './worker_hacks';

import * as Comlink from 'comlink';

import { ArenaBridge } from '../classes/ArenaBridge';

Comlink.expose(ArenaBridge, self as Comlink.Endpoint);
