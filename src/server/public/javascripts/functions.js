//頻度が多い関数関連
((g) => {

  g.globalfreespace = g.globalfreespace || {};
  g.fnc = g.fnc || {};

  g.fnc.f = async (f) => {
    return f();
  }

  const hsla = g.fnc.hsla = (h, l, s, a) => {
    return "hsl(" + h + "," + l + "%," + s + "%," + a + ")";
  }


















  //mapへの平均値の描画
  //引数は9個のエリア「num」の含まれるary．   [a1,a2,a3,a4,a5,a6,a7,a8,a9]　それぞれの平均値を出力．ないときは”noData”
  //同じ数字は同じ色．var color = "hsl(" + hue + ", 100%, 50%)";
  g.fnc.draw2 = async (id, args, tani) => {
    let avg = ["NoData", "NoData", "NoData", "NoData", "NoData", "NoData", "NoData", "NoData", "NoData"];
    let _avg = ["NoData", "NoData", "NoData", "NoData", "NoData", "NoData", "NoData", "NoData", "NoData"];
    let area = document.getElementById("container").children;

    let ary = [];
    for(let i = 1; i < args.length;i++){
      ary.push(args[i][1]);
    }
    //console.log(args)

    await g.fnc.f(() => {
      for (let i = 0; i < ary.length; i++) {
        if (ary[i] && ary[i].length > 0) {
          avg[i] = 0;
          for (let j = 0; j < ary[i].length; j++) {
            avg[i] += parseFloat(ary[i][j]);
          }
          let m1 = Math.floor((avg[i] / ary[i].length));
          let m2 = Math.floor(100 * (avg[i] / ary[i].length)) * 0.01;
          let m3 = m2 - m1;
          let m4 = Math.floor(100 * m3);
          avg[i] = "" + m1 + "." + m4 + "<div style='display:inline;font-size:0.5em;'>" + tani + "</div>";
          _avg[i] = parseFloat("" + m1 + "." + m4)
        }
      }
    });

    let CA = await g.fnc.setColor(_avg);
    await g.fnc.f(() => {
      for (let i = 0; i < avg.length; i++) {
        area[i].innerHTML = avg[i];
        area[i].style.cssText += "background-color: " + CA[i] + " !important;";
      }
    });
    globalfreespace.color = CA;
  } //draw2


















  //mapへの合計値の描画
  //引数は9個のエリア「num」の含まれるary．   [a1,a2,a3,a4,a5,a6,a7,a8,a9]　それぞれの合計値を出力．ないときは”noData”
  g.fnc.draw3 = async (id, args, tani) => {
    let area = document.getElementById("container").children;
    let sum = ["NoData", "NoData", "NoData", "NoData", "NoData", "NoData", "NoData", "NoData", "NoData"];
    let ary = [];
    for(let i = 1; i < args.length;i++){
      ary.push(args[i][1]);
    }
    await g.fnc.f(() => {
      for (let i = 0; i < sum.length; i++) {
        if (ary[i] && ary[i].length > 0) {
          sum[i] = 0;
          for (let j = 0; j < ary[i].length; j++) {
            sum[i] += parseFloat(ary[i][j]);
          }
        }
      }
    });

    let CA = await g.fnc.setColor(sum);

    await g.fnc.f(() => {
      for (let i = 0; i < sum.length; i++) {
        area[i].innerHTML = sum[i] + "<div style='display:inline;font-size:0.5em;'>" + tani + "</div>";
        area[i].style.cssText += "background-color: " + CA[i] + " !important;";
      }
    });

    globalfreespace.color = CA;
  } //draw3



















    g.fnc.setColor = async (data) => {
      let color = [
        hsla(0, 0, 50, 0.5),
        hsla(0, 0, 50, 0.5),
        hsla(0, 0, 50, 0.5),
        hsla(0, 0, 50, 0.5),
        hsla(0, 0, 50, 0.5),
        hsla(0, 0, 50, 0.5),
        hsla(0, 0, 50, 0.5),
        hsla(0, 0, 50, 0.5),
        hsla(0, 0, 50, 0.5),
      ];
      //60～310の間で等分するそのhslaを配列で返す.初期はNonDataColor
      //の予定だったがやっぱ180～360で移動させる

      let delta = 0; //同じデータがあったら減る，等分した色の幅

      let _data = []; //_dataは，NoDataではない数字のみで構成されたデータ．
      let _dataIndex = []; //_dataIndexは，_dataにあるデータの元の場所．これでdataにすぐ戻れる
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== "NoData") {
          _data.push(data[i]);
          _dataIndex.push(i);
        }
      }

      //ここでソート（バブルww）
      for (let i = 0; i < _data.length; i++) {
        for (let j = _data.length - 1; j > i; j--) {
          if (_data[j] < _data[j - 1]) {
            let _tmp = _data[j];
            _data[j] = _data[j - 1];
            _data[j - 1] = _tmp;
            _tmp = _dataIndex[j];
            _dataIndex[j] = _dataIndex[j - 1];
            _dataIndex[j - 1] = _tmp;
          }
        }
      }

      //ここで，同じ値のものの数を取得して，deltaの幅数を調整する
      let deltaCount = _dataIndex.length;
      for(let i = 0,tmp = 0; i < _data.length;i++){
        if(i === 0){
          tmp = _data[i];
        }else{
          if(tmp === _data[i]){
            deltaCount -= 1;
          }else{
            tmp = _data[i];
          }
        }
      }


      //色幅は，例えばデータが４つなら，(250/(4-1)|0=83,)60，60+83,60+83*2,60+83*3
      delta = (360 - 180)/(deltaCount - 1 + 0.01)|0;
      for(let i = 0,tmp = 0,j = 0; i < _dataIndex.length; i++){
        if(i === 0){
          tmp = _data[i];
          color[_dataIndex[i]] = hsla(180 + delta * j, 70, 60, 0.5);
        }else{
          if(tmp !== _data[i]){
            tmp = _data[i];
            j += 1;
          }
          color[_dataIndex[i]] = hsla(180 + delta * j, 70, 60, 0.5);
        }
      }

      return color;
    }//setColor


    g.fnc.nomal = (numbers) => {
      let s = 0,
        ans = Array.from(numbers);
      for (let i = 0; i < numbers.length; i++) {
        s += numbers[i];
      }
      if (s !== 0) {
        let ratio = Math.max(...numbers) / 100;
        ans = numbers.map(v => Math.round(v / (ratio)));
      }
      return ans;
    }





})(this);
