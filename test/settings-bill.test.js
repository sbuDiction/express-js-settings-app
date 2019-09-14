const assert = require("assert");
const settingsBill = require("../Settings-bill");

describe("Settings Bill Tests", function() {
  it("should return the cost set in the settings or limit", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 5,
      warningLevel: 20,
      criticalLevel: 40
    });

    assert.deepEqual(instance.displaySettings(), {
      smsCost: 2,
      callCost: 5,
      warningLevel: 20,
      criticalLevel: 40
    });
  });

  it("should be able to record for sms when an sms is made", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 5,
      warningLevel: 20,
      criticalLevel: 40
    });
    instance.bill("sms");
    assert.deepEqual(instance.displayActions(), [
      { type: "sms", cost: 2, timestamp: new Date() }
    ]);
  });

  it("should be able to record for call when an call is made", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 5,
      warningLevel: 10,
      criticalLevel: 20
    });
    instance.bill("call");
    assert.deepEqual(instance.displayActions(), [
      { type: "call", cost: 5, timestamp: new Date() }
    ]);
  });

  it("should be able to record for both sms and call ", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 5,
      warningLevel: 10,
      criticalLevel: 20
    });
    instance.bill("call");
    instance.bill("sms");
    assert.deepEqual(instance.displayActions(), [
      { type: "call", cost: 5, timestamp: new Date() },
      { type: "sms", cost: 2, timestamp: new Date() }
    ]);
  });
});

describe("Making multiple calls and sms's Test", function() {
  it("should return the cost if 5x sms @R2.00 are made and 5x calls @R5.00", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 5,
      warningLevel: 20,
      criticalLevel: 40
    });
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    // instance.getTotal();
    assert.deepEqual(instance.totals(), {
      smsTotal: 10,
      callTotal: 25,
      grandTotal: 35
    });
  });

  it("should return the cost set in the settings or limit", function() {
    let instance = settingsBill();
    instance.updateSettings({
      smsCost: 2,
      callCost: 5,
      warningLevel: 20,
      criticalLevel: 40
    });
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    instance.bill("sms");
    instance.bill("call");
    // instance.getTotal();
    assert.deepEqual(instance.totals(), {
      smsTotal: 10,
      callTotal: 25,
      grandTotal: 35
    });
  });
});
