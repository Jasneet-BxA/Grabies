// src/setupTests.ts

import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for Jest environment
if (typeof TextEncoder === 'undefined') {
  // @ts-ignore
  global.TextEncoder = require('util').TextEncoder;
}

if (typeof TextDecoder === 'undefined') {
  // @ts-ignore
  global.TextDecoder = require('util').TextDecoder;
}
