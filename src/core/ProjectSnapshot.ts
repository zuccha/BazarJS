import { Patch } from './Patch';

export interface ProjectSnapshot {
  name: string;
  patches: Patch[];

  directory: string;
}
