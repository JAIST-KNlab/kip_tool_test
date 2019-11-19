let common = {
  socket: null
};

((g) => {

  g.globalfreespace = g.globalfreespace || {};
  g.fnc = g.fnc || {};
  g.AreaNum = 9;
  g.fnc.f = async (f) => {
    return f();
  }

  const datas = g.val;

  g.addEventListener('load', () => {
    common.socket = io.connect();

    common.socket.on('connect', (data) => {
      common.socket.emit('test', "プレビュー接続完了");

      common.socket.on("data", (data) => {

        common.socket.emit('test', "プレビュー受信完了");
        g.fnc.maindraw(data);
      });
    });
  });

  g.fnc.maindraw = (data) => {
    const dataIndex = [{
        "name": "温度",
        "unit": "℃"
      }, //0
      {
        "name": "湿度",
        "unit": "%"
      }, //1
      {
        "name": "照度",
        "unit": "lx"
      }, //2
      {
        "name": "UVI",
        "unit": "UV"
      }, //3
      {
        "name": "不快指数",
        "unit": "不快指数"
      }, //4
      {
        "name": "気圧",
        "unit": "hPa"
      }, //5
      {
        "name": "騒音",
        "unit": "dB"
      }, //6
      {
        "name": "暑さ指数",
        "unit": "WBGT"
      }, //7
      {
        "name": "総人数",
        "unit": "人"
      }, //8
      {
        "name": "平均人数",
        "unit": "人"
      }, //9
      {
        "name": "休憩人数",
        "unit": "人"
      }, //10
      {
        "name": "休憩女性数",
        "unit": "人"
      }, //11
      {
        "name": "休憩笑顔数",
        "unit": "個"
      }, //12
      {
        "name": "休憩感情(hapiness)",
        "unit": "%"
      }, //13
      {
        "name": "休憩感情(surprise)",
        "unit": "%"
      }, //14
      {
        "name": "休憩感情(neutral)",
        "unit": "%"
      }, //15
      {
        "name": "休憩感情(sadness)",
        "unit": "%"
      }, //16
      {
        "name": "休憩感情(anger)",
        "unit": "%"
      }, //17
      {
        "name": "休憩感情(contempt)",
        "unit": "%"
      }, //18
      {
        "name": "休憩感情(disgust)",
        "unit": "%"
      }, //19
      {
        "name": "休憩感情(fear)",
        "unit": "%"
      } //20
    ];

    if (data) {
      (async () => {
        //とりあえず１つのやつ
        if (data.metric.length === 1) {
          let key = data.metric[0];
          let tmp = [];
          document.getElementById("subtitle").innerHTML = dataIndex[key].name;

          //0～7 -> 3,5    && d1,d2  && draw2
          //8+9 -> all     && d3    && draw2,draw3
          //10～20 -> 4,   && d4    && draw2
          switch (key) {
            case 0: //"気圧[hPa]":
            case 1: //"湿度[%]":
            case 2: //"照度[lx]":
            case 3: //"UVI[UV]":
            case 4: //"騒音[dB]":
            case 5: //"温度[℃]":
            case 6: //"WBGT(暑さ指数)":
            case 7: //"不快指数":

              await g.fnc.f(() => {
                tmp = new Array();
                for (let i = 0; i < g.AreaNum; i++) {
                  switch (i) {
                    case 3:
                      tmp.push(["エリア4", datas.data1[dataIndex[key].name]]);
                      break;
                    case 5:
                      tmp.push(["エリア6", datas.data2[dataIndex[key].name]]);
                      break;
                    default:
                      tmp.push([]);
                  }
                }
                tmp.unshift(["日時", datas.data1.timestamps]);
              });
              await g.fnc.draw2("chart1", tmp, "(" + dataIndex[key].unit + ")");
              await g.fnc.draw1("chart2", tmp);
              break;
            case 8: //"総人数":
            case 9: //"平均人数":
              tmp = [];
              await g.fnc.f(() => {
                tmp.unshift(["日時", datas.data3.timestamps]);
                for (let i = 0; i < g.AreaNum; i++) {
                  tmp.push(["エリア" + (i + 1), datas.data3["エリア" + (i + 1)]])
                }
              });
              switch (key) {
                case 8:
                  await g.fnc.draw3("chart1", tmp, dataIndex[key].unit) //合計
                  break;
                case 9:
                  await g.fnc.draw2("chart1", tmp, dataIndex[key].unit) //平均
                  break;
              }
              await g.fnc.draw1("chart2", tmp);
              break;
            case 10: //case "休憩人数":
            case 11: //"休憩女性数":
            case 12: //"休憩笑顔数":
            case 13: //"休憩感情(hapiness)":
            case 14: //"休憩感情(surprise)":
            case 15: //"休憩感情(neutral)":
            case 16: //"休憩感情(sadness)":
            case 17: //"休憩感情(anger)":
            case 18: //"休憩感情(contempt)":
            case 19: //"休憩感情(disgust)":
            case 20: //"休憩感情(fear)":
              tmp = [];
              await g.fnc.f(() => {
                tmp.push(["日時", datas.data4.timestamps]);
                for (let i = 0; i < g.AreaNum; i++) {
                  switch (i) {
                    case 4:
                      tmp.push(["エリア5", datas.data4[dataIndex[key].name]]);
                      break;
                    default:
                      tmp.push([]);
                  }
                }
              });
              await g.fnc.draw2("chart1", tmp, "(" + dataIndex[key].unit + ")"); //平均
              await g.fnc.draw1("chart2", tmp);
              break;
          } //switch文
        } else if (data.metric.length > 1) {
          //それぞれのdata.metricのループの中で，
          //tmpに対してdataを重み付き可算していく
          let key = data.metric[0];
          let tmp2 = [];
          for (let i = 0; i < g.AreaNum; i++) {
            tmp2.push([]);
          }
          tmp2.push([]);

          let Length = datas.data3.timestamps.length;
          //次元統一（最も少ないdata3に合わせるが，まずは1時間おきに治す）
          //9時から20時に統一した．元のファイルを．

          for (let i = 0; i < data.metric.length; i++) {

            let key = data.metric[i] | 0;
            let w = parseFloat(data.weight[i]);

            switch (key) {
              case 0: //"気圧[hPa]":
              case 1: //"湿度[%]":
              case 2: //"照度[lx]":
              case 3: //"UVI[UV]":
              case 4: //"騒音[dB]":
              case 5: //"温度[℃]":
              case 6: //"WBGT(暑さ指数)":
              case 7: //"不快指数":

                await g.fnc.f(() => {
                  for (let i = 0; i < g.AreaNum + 1; i++) {
                    switch (i) {
                      case 0:
                        tmp2[0] = ["日時", datas.data1.timestamps];
                        break;
                      case 4:
                      case 6:
                        let d = {};
                        switch (i) {
                          case 4:
                            d = datas.data1;
                            break;
                          case 6:
                            d = datas.data2;
                            break;
                        }
                        if (tmp2[i].length > 0) {
                          for (let j = 0; j < Length; j++) {
                            tmp2[i][1][j] = "" +
                              (parseFloat(tmp2[i][1][j]) + w * parseFloat(d[dataIndex[key].name][j]));
                          }
                        } else {
                          tmp2[i].push("エリア" + i);
                          tmp2[i].push([]);
                          for (let j = 0; j < Length; j++) {
                            tmp2[i][1].push("" + w * parseFloat(d[dataIndex[key].name][j]));
                          }
                        }
                        break;
                    }
                  }
                });
                break;
              case 8: //"総人数":
              case 9: //"平均人数":
                //平均とする
                await g.fnc.f(() => {
                  tmp2[0] = ["日時", datas.data3.timestamps];
                  for (let k = 1; k < g.AreaNum + 1; k++) {
                    if (tmp2[k].length > 0) {
                      for (let j = 0; j < Length; j++) {
                        tmp2[k][1][j] = "" + (parseFloat(tmp2[k][1][j]) + w * parseFloat(datas.data3["エリア" + k][j]));
                      }
                    } else {
                      tmp2[k].push("エリア" + k);
                      tmp2[k].push([]);
                      for (let j = 0; j < Length; j++) {
                        tmp2[k][1].push("" + w * parseFloat(datas.data3["エリア" + k][j]));
                      }
                    }
                  }

                });
                break;
              case 10: //case "休憩人数":
              case 11: //"休憩女性数":
              case 12: //"休憩笑顔数":
              case 13: //"休憩感情(hapiness)":
              case 14: //"休憩感情(surprise)":
              case 15: //"休憩感情(neutral)":
              case 16: //"休憩感情(sadness)":
              case 17: //"休憩感情(anger)":
              case 18: //"休憩感情(contempt)":
              case 19: //"休憩感情(disgust)":
              case 20: //"休憩感情(fear)":
                await g.fnc.f(() => {

                  for (let i = 0; i < g.AreaNum + 1; i++) {
                    switch (i) {
                      case 0:
                        tmp2[0] = ["日時", datas.data4.timestamps];
                        break;
                      case 5:
                        if (tmp2[i].length > 0) {
                          for (let j = 0; j < Length; j++) {
                            tmp2[i][1][j] = "" +
                              (parseFloat(tmp2[i][1][j]) +
                                w * parseFloat(datas.data4[dataIndex[key].name][j]));
                          }
                        } else {
                          tmp2[i].push("エリア" + i);
                          tmp2[i].push([]);
                          for (let j = 0; j < Length; j++) {
                            tmp2[i][1].push("" +
                              w * parseFloat(datas.data4[dataIndex[key].name][j]));
                          }
                        }
                        break;
                    }
                  }
                });
                break;
            } //switch文

          } //for文
          //描画フェーズ
          document.getElementById("subtitle").innerHTML = data.name;
          await g.fnc.draw2("chart1", tmp2, "")
          await g.fnc.draw1("chart2", tmp2);
          tmp2 = [];
        } //else if文
      })();
    }
  }

})(this);
