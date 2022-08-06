const itemJson = getJsonData("./data/item.json");
const tableJson = getJsonData("./data/table.json");

$(function () {
  creteSelectForms();
  $("#checkButton").click(function() {
    var priceTunacan = 0;
    var priceYen = 0;

    // select-box要素取得
    const selectBox = document.getElementById("select-box");
    const selectCnt = selectBox.childElementCount
    for(var i = 0; i < selectCnt; i++) {
      let selectDay = document.getElementById("select-day" + (i+1));
      let num = selectDay.selectedIndex;
      let val = selectDay.options[num].value;

      // 選択項目から価格を算出
      let price = calcPrice(val);
      priceTunacan += price.tunacan;
      priceYen += price.yen;
    }

    // 結果表示
    $("#price-tunacan").text("ツナ缶" + orgFloor(priceTunacan, 100) + "個");
    $("#price-yen").text(orgFloor(priceYen, 100) + "円");
  });
});

/**
 * プルダウンリストを作成
 */
function creteSelectForms() {
  // select-box要素取得
  const selectBox = document.getElementById("select-box");

  const table = tableJson.table;
  const dayCnt = table.length;
  for (var i = 0; i < dayCnt; i++) {
    var day = i + 1;
    // select要素作成
    const selectDay = document.createElement("select");
    selectDay.id = "select-day" + day;
    selectDay.name = "select-day" + day;

    // select-box要素にselectを追加
    selectBox.appendChild(selectDay);

    const optionList = table[i];
    const optionListLen = optionList.length;
    for (var j = 0; j < optionListLen; j++) {
      // option要素作成
      const option = document.createElement("option");
      let id  = optionList[j].id;
      let amount = optionList[j].amount;
      option.value = id + "_" + amount;
      option.textContent = itemJson[id].name + "×" + amount;

      // select要素にoptionを追加
      selectDay.appendChild(option);
    }
  }
}

/**
 * 選択したvalueからアイテム価格を算出
 * @param {String} selectVal 
 * @returns 
 */
function calcPrice(selectVal) {
  // selectValからアイテムIDと個数を取得
  // 例："buhin3000_1" ⇒ "buhin3000", "1"
  const split = selectVal.split("_");
  const id = split[0];
  const amount = split[1];

  // アイテムIDから価格を抽出
  const priceTunacan = itemJson[id].price_tunacan * Number(amount);
  const priceYen = itemJson[id].price_yen * Number(amount);

  var ret = {
    tunacan: priceTunacan,
    yen: priceYen
  };

  return ret;
}

/**
 * 任意の桁で切り捨て
 * @param {number} value 
 * @param {number} base 
 * @return {number} 
 */
 function orgFloor(value, base) {
  return Math.floor(value * base) / base;
}

/**
 * JSONファイルからデータ取得
 * @param {String} url JSONファイルURL
 * @returns 
 */
function getJsonData(url) {
  var ret;
  $.ajaxSetup({async: false});
  $.getJSON(url, (data) => {
    ret = data;
  });
  $.ajaxSetup({async: true});

  return ret;
}