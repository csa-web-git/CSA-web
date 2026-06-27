import * as migration_20260625_154557 from './20260625_154557';
import * as migration_20260627_110508 from './20260627_110508';

export const migrations = [
  {
    up: migration_20260625_154557.up,
    down: migration_20260625_154557.down,
    name: '20260625_154557',
  },
  {
    up: migration_20260627_110508.up,
    down: migration_20260627_110508.down,
    name: '20260627_110508'
  },
];
