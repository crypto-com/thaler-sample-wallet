import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";

import { WalletService } from "./wallet.service";
import BigNumber from "bignumber.js";

describe("WalletService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: WalletService = TestBed.get(WalletService);
    expect(service).toBeTruthy();
  });

  describe("addWallet", () => {
    it("should add the wallet", async () => {
      const service: WalletService = TestBed.get(WalletService);
      const walletId = "New Wallet";

      await service.addWallet(walletId).toPromise();
      const walletList = await service.getWalletList().toPromise();
      expect(walletList.length).toBeGreaterThan(0);

      const lastWallet = walletList[walletList.length - 1];
      expect(lastWallet).toEqual({
        id: walletId,
        balance: new BigNumber(0),
        addresses: []
      });
    });

    it("should throw error when the wallet id is duplicated", async done => {
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

  describe("getWalletList", () => {
    it("should return an observable", () => {
      const service: WalletService = TestBed.get(WalletService);
      expect(service.getWalletList()).toEqual(jasmine.any(Observable));
    });

    it("should resolve an array of wallets in the memory", async () => {
      const service: WalletService = TestBed.get(WalletService);
      const walletList = await service.getWalletList().toPromise();

      expect(walletList).toEqual(jasmine.any(Array));
    });
  });
});
