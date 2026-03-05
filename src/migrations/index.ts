import * as migration_20260303_053444 from './20260303_053444';
import * as migration_20260305_130806 from './20260305_130806';

export const migrations = [
  {
    up: migration_20260303_053444.up,
    down: migration_20260303_053444.down,
    name: '20260303_053444',
  },
  {
    up: migration_20260305_130806.up,
    down: migration_20260305_130806.down,
    name: '20260305_130806'
  },
];
