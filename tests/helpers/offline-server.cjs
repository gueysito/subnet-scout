// Child-process test fence: no outbound connections or inherited credentials.
const http = require('node:http');
const net = require('node:net');
const https = require('node:https');
const deny = () => { throw new Error('OUTBOUND_NETWORK_DISABLED_IN_TEST'); };
globalThis.fetch = deny;
https.request = deny;
https.get = deny;
net.Socket.prototype.connect = deny;
const listen = http.Server.prototype.listen;
http.Server.prototype.listen = function (...args) {
  this.once('listening', () => process.send?.({ testAddress: this.address() }));
  return listen.apply(this, args);
};
