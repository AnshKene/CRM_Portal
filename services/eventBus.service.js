import EventEmitter from 'node:events';

class CRMEventBus extends EventEmitter {}

export const eventBus = new CRMEventBus();
