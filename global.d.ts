// global.d.ts
export {};

declare global {
  interface Window {
    mockPriceReceived: boolean;
  }
}
