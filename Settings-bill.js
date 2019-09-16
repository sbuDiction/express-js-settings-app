module.exports = function() {
  let smsCost;
  let callCost;
  let warningLevel;
  let criticalLevel;
  let actionList = [];

  const updateSettings = settings => {
    smsCost = Number(settings.smsCost);
    callCost = Number(settings.callCost);
    warningLevel = Number(settings.warningLevel);
    criticalLevel = Number(settings.criticalLevel);
  };

  const displaySettings = () => {
    return {
      smsCost,
      callCost,
      warningLevel,
      criticalLevel
    };
  };

  const bill = action => {
    if (!stopAdding()) {
      let cost = 0.0;
      if (action == "sms") {
        cost += smsCost;
      } else if (action == "call") {
        cost += callCost;
      }
      actionList.push({
        type: action,
        cost,
        timestamp: new Date()
      });
    }
  };

  const displayActions = () => {
    return actionList;
  };

  const actionsFor = type => {
    return actionList.filter(action => action.type == type);
  };

  const getTotal = type => {
    return actionList.reduce((total, action) => {
      let val = action.type == type ? action.cost : 0.0;
      return total + val;
    }, 0.0);
  };

  const grandTotal = () => {
    return getTotal("sms") + getTotal("call");
  };

  const totals = () => {
    let smsTotal = getTotal("sms").toFixed(2);
    let callTotal = getTotal("call").toFixed(2);
    return {
      smsTotal,
      callTotal,
      grandTotal: grandTotal().toFixed(2)
    };
  };
  const stopAdding = () => {
    return grandTotal() >= criticalLevel;
  };

  const whichLevel = () => {
    if (grandTotal() >= warningLevel && grandTotal() < criticalLevel) {
      return "warning";
    } else if (grandTotal() >= criticalLevel) {
      return "danger";
    }
  };

  return {
    updateSettings,
    displaySettings,
    bill,
    displayActions,
    actionsFor,
    getTotal,
    grandTotal,
    totals,
    whichLevel,
    stopAdding
  };
};
