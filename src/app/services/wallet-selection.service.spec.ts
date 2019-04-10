import { TestBed } from "@angular/core/testing";

import { WalletSellectionService } from "./wallet-selection.service";

describe("WalletSellectionService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: WalletSellectionService = TestBed.get(
      WalletSellectionService
    );
    expect(service).toBeTruthy();
  });
});
