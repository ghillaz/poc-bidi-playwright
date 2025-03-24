import { test, expect } from '@playwright/test';
import { CoinMarketCapPage } from "@/pages/coinmarketcap-page";

test('Mock WebSocket messages and verify price update', async ({ page }) => {
  const coinMarketCapPage = new CoinMarketCapPage(page);

  await page.goto(`${process.env.BTC_URL}`);

/*
Option 1: Blocking All Messages from Server to Page

If you want to block all messages coming from the server, you can stop forwarding them by implementing a handler that does nothing:
*/
  await page.routeWebSocket('/ws', ws => {
    const server = ws.connectToServer();

    // Block all messages coming from the server
    server.onMessage(message => {
      console.log(`Blocking message from server: ${message}`);
      // No forwarding to the page, so effectively blocking all server messages
    });
  });

  /*
  Option 2: Blocking All Messages from Page to Server

  If you want to block all messages that the page sends to the server:
  */
  await page.routeWebSocket('/ws', ws => {
    ws.onMessage(message => {
      console.log(`Blocking message from page: ${message}`);
      // No forwarding to the server, so effectively blocking all page messages
    });
  });

  /*
  Option 3: Blocking Messages Both Ways

  If you want to block all messages in both directions (server to page and page to server), simply call onMessage() for both and avoid forwarding the messages:
  */
  await page.routeWebSocket('/ws', ws => {
    const server = ws.connectToServer();

    // Block messages from page to server
    ws.onMessage(message => {
      console.log(`Blocking message from page: ${message}`);
    });

    // Block messages from server to page
    server.onMessage(message => {
      console.log(`Blocking message from server: ${message}`);
    });
  });

  /*
  Option 4: Mocking Messages Instead of Blocking

  If you want to mock the messages instead of completely blocking them (e.g., replace server messages with mock data):
  */
  await page.routeWebSocket('/ws', ws => {
    const server = ws.connectToServer();

    // Mock messages sent from the page to the server
    ws.onMessage(message => {
      const mockMessage = JSON.stringify({ mock: true });
      console.log(`Mocking message to server: ${mockMessage}`);
      server.send(mockMessage);
    });

    // Mock messages sent from the server to the page
    server.onMessage(message => {
      const mockResponse = JSON.stringify({ mockedData: 'This is a mock response' });
      console.log(`Mocking message to page: ${mockResponse}`);
      ws.send(mockResponse);
    });
  });
});
