import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";

import { WalletService } from "./wallet.service";
import { Wallet } from './types/wallet';
import BigNumber from 'bignumber.js';

describe("WalletService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: WalletService = TestBed.get(WalletService);
    expect(service).toBeTruthy();
  });

  describe("addWallet", () => {
    it("should add the wallet", () => {
      const service: WalletService = TestBed.get(WalletService);
      const walletId = "New Wallet";

      return service.addWallet(walletId).toPromise().then(() => {
        return service.getWallets().toPromise().then(wallets => {
          expect(wallets.length).toBeGreaterThan(0);

          const lastWallet = wallets[wallets.length - 1];
          expect(lastWallet).toEqual({
            id: walletId,
            balance: new BigNumber(0),
            addresses: [],
          });
        });
      });
    });

    it("should throw error when the wallet id is duplicated", async (done) => {
      const service: WalletService = TestBed.get(WalletService);
      const walletId = "New Wallet";

      await service.addWallet(walletId).toPromise();
      try {
        await service.addWallet(walletId).toPromise();
      } catch (error) {
        expect(error).toEqual(new Error("Duplicated wallet id"));
        done();
      }
    });
  });

  describe("getWallets", () => {
    it("should return an observable", () => {
      const service: WalletService = TestBed.get(WalletService);
      expect(service.getWallets()).toEqual(jasmine.any(Observable));
    });

    it("should resolve an array of wallets in the memory", () => {
      const service: WalletService = TestBed.get(WalletService);
      return service.getWallets().toPromise().then(wallets => {
        expect(wallets).toEqual(jasmine.any(Array));
      });
    });
  });
});
