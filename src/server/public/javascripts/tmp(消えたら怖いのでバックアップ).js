
let common = {
  socket: null
};


((g) => {

  g.globalfreespace = g.globalfreespace || {};

  g.f = async (f) => {
    return f();
  }

  g.addEventListener('load', () => {
    //common.socket = io.connect();
    //common.socket.on('io_key', function(data) {
    //if (data && data.metric && data.weight && (data.metric.length === data.weight.length)) {

    //}
    //});


    ///{“metric”:[1,2,3], weight:[1,1,2]}

    //実験として描画
    //data1での実験
    (async () => {
      let x = g.data1.timestamps;
      //await draw1("chart2",["日時",x],["騒音[dB]",g.data1["騒音[dB]"]],["温度[℃]",g.data1["温度[℃]"]]);
      await draw1("chart2",["日時",x],["エリア4の温度[℃]",g.data1["温度[℃]"]],["エリア6の温度[℃]",g.data2["温度[℃]"]]);
    //await draw1(x, g.data1["温度[℃]"], "日時", "温度[℃]", "chart2");
    })();


    //実験として描画
    //data3での実験
    (async () => {
      let d = [0, 0, 0, 0, 0, 0, 0, 0, 0],
        dd = g.data3;
      await g.f(() => {
        for (let i = 0; i < d.length; i++) {
          d[i] = dd["エリア" + (i + 1)]
        }
      });
      await draw2(d, "人")
    })();

    //実験として描画
    //data1,data2での実験
    /*(async () => {
      let d = [
        [],
        [],
        [], g.data1["温度[℃]"],
        [], g.data2["温度[℃]"],
        [],
        [],
        []
      ]
      await draw2(d, "℃")
    })();*/

  });



  //時系列グラフの領域に描画
  //ただし，argsは[[index,数字の配列],[],...]
  const draw1 = async (id, ...args) => {
      let data = [];
      await g.f(() => {
        for (let i = 0, tmp = []; i < args[0][1].length; i++, tmp = []) {
          tmp.push(args[0][1][i]);
          for(let j = 1; j < args.length; j++){
            tmp.push(args[j][1][i] | 0);
          }
          data.push(tmp);
        }
      });
      let index = []
      for(let i = 0; i < args.length; i++){
        index.push(args[i][0])
      }
      data.unshift(index)



      //折れ線グラフ
      let dataset = [];
      var timeparser = d3.timeFormat("%Y-%m-%e-%H-%M");
      console.log(data);


      for(let i=1;i<data.length;i++){
        dataset[i-1] = [(data[i][0]),(data[i][1])];
      }

      /*dataset = dataset.map(function(d){
        return {timeparser(d[0]),d[1]};
      });*/

      console.log(dataset);


      var w = 800;
      var h = 300;
      var width = 400;
      var height = 300;
      const padding=30;

      const xScale = d3.scaleLinear()
      .domain([0,d3.max(dataset,function(d){return d[0];})])
      .range([padding,w-padding]);
      const yScale = d3.scaleLinear()
      .domain([0,d3.max(dataset,function(d){return d[1];})])
      .range([h-padding,padding]);
      const xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(5);
      const yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(5);


      var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);


      svg.append("g")
      .attr("class","axis")
      .attr("transform","translate(0,"+(h-padding)+")")
      .call(xAxis);

      svg.append("g")
      .attr("class","axis")
      .attr("transform","translate("+padding+",0)")
      .call(yAxis);

      svg.append("path")
      .datum(dataset)
      .attr("fill","none")
      .attr("stroke","steelblue")
      .attr("stroke-width",1.5)
      .attr("d",d3.line()
         .x(function(d){return xScale(d[0]);})
         .y(function(d){return yScale(d[1]);})
       );

      /*
      g.globalfreespace = data;

      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(() => {
        let options = {
          isStacked: true
        };
        g.chart2_options = options;
        let data = google.visualization.arrayToDataTable(g.globalfreespace);
        g.chart2_data = data;
        let stage = document.getElementById(id);
        let chart = new google.visualization.LineChart(stage);
        g.chart2 = chart;
        chart.draw(data, options);
      });
  */
}

  const re_draw1 = async (id, ...args) => {
      let data = [];
      await g.f(() => {
        for (let i = 0, tmp = []; i < args[0][1].length; i++, tmp = []) {
          tmp.push(args[0][1][i]);
          for(let j = 1; j < args.length; j++){
            tmp.push(args[j][1][i] | 0);
          }
          data.push(tmp);
        }
      });
      let index = []
      for(let i = 0; i < args.length; i++){
        index.push(args[i][0])
      }
      data.unshift(index)

      g.chart2.draw(google.visualization.arrayToDataTable(data), g.chart2_options);
  }


  //mapへの平均値の描画
  //引数は9個のエリア「num」の含まれるary．   [a1,a2,a3,a4,a5,a6,a7,a8,a9]　それぞれの平均値を出力．ないときは”noData”
  //同じ数字は同じ色．var color = "hsl(" + hue + ", 100%, 50%)";
  const draw2 = async (ary, tani) => {
    let avg = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let _avg = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let area = document.getElementById("container").children;

    await g.f(() => {
      for (let i = 0; i < ary.length; i++) {
        if (ary[i] && ary[i].length > 0) {
          avg[i] = 0;
          for (let j = 0; j < ary[i].length; j++) {
            avg[i] += (ary[i][j] | 0);
          }
          //少数点誤差を文字列で対処
          let m1 = Math.floor((avg[i] / ary[i].length));
          let m2 = Math.floor(100*(avg[i] / ary[i].length)) * 0.01;
          let m3 = m2 - m1;
          let m4 = Math.floor(100 * m3);
          avg[i] = "" + m1 + "." + m4 + "<div style='display:inline;font-size:0.5em;'>" + tani + "</div>";
          _avg[i] = ("" + m1 + "." + m4)|0
          //avg[i] = "" + (Math.floor(100 * (avg[i] / ary[i].length)) * 0.01) + tani;
        } else {
          avg[i] = "NoData";
        }
      }
    });

    let CA = [
      hsla(310, 70, 60, 0.5),
      hsla(280, 70, 60, 0.5),
      hsla(250, 70, 60, 0.5),
      hsla(210, 70, 60, 0.5),
      hsla(180, 70, 60, 0.5),
      hsla(150, 70, 60, 0.5),
      hsla(120, 70, 60, 0.5),
      hsla(90, 70, 60, 0.5),
      hsla(60, 70, 60, 0.5)
    ]

    let avgtmp = _avg;
    avgtmp.sort((a,b)=>{
      return a-b;
    })
    console.log(avgtmp,_avg)

    /*for (let i = CA.length - 1,tmp = CA[i],r = Math.floor(Math.random() * (i + 1)); i > 0; i--, tmp = CA[i],r = Math.floor(Math.random() * (i + 1))) {
      CA[i] = CA[r];
      CA[r] = tmp;
    }*/


    for (let i = 0, nums = checkary(avg); i < avg.length; i++) {
      area[i].innerHTML = avg[i];

      if (nums[i].length > 0) {
        for (let j = 0; j < nums[i].length; j++) {
          CA[nums[i][j]] = CA[i];
        }
      }

      if (avg[i] === "NoData") {
        area[i].style.cssText += "background-color: " + hsla(0, 0, 50, 0.5) + " !important;";
      } else {
        area[i].style.cssText += "background-color: " + CA[i] + " !important;";
      }
    }
  }


  //配列の同じ要素がある場合はそれのindexを配列で返す．
  //返り血の例[[],[],[1,2],[],[1],...]
  const checkary = (a) => {
    let ans = [];
    for (let i = 0, tmp = []; i < a.length; i++, tmp = []) {
      for (let j = 0; j < a.length; j++) {
        if (i !== j && a[j] === a[i]) {
          tmp.push(j)
        }
      }
      ans.push(tmp);
    }
    return ans;
  }

  const hsla = (h, l, s, a) => {
    return "hsl(" + h + "," + l + "%," + s + "%," + a + ")";
  }

  g.addEventListener('load',()=>{
    common.socket = io.connect();

    common.socket.on('connect', (data) => {
      common.socket.emit('test', "プレビュー接続完了");

      common.socket.on("data", (data) => {
        common.socket.emit('test', "プレビュー受信完了");
        if(data && data.name && data.metric){
          (async () => {
            let x = g.data1.timestamps;

            console.log(data)

            switch(data.name){
              case "気圧[hPa]":
              case "湿度[%]":
              case "照度[lx]":
              case "UVI[UV]":
              case "騒音[dB]":
              case "温度[℃]":
              case "WBGT(暑さ指数)":
              case "不快指数":
                console.log("描画！")
                //await re_draw1(x, g.data1[data.name], "日時", data.name, "chart2");
                await draw2([
                  [],
                  [],
                  [], g.data1[data.name],
                  [], g.data2[data.name],
                  [],
                  [],
                  []
                ], "(" + data.name + ")");
                break;
              case "総人数":
                let d = [0, 0, 0, 0, 0, 0, 0, 0, 0],
                dd = g.data3;
                await g.f(() => {

                  for (let i = 0,t = 0; i < d.length; i++,t = 0) {
                    d[i] = [];
                    for(let j = 0;j < dd["エリア" + (i + 1)].length;j++){
                      t += (dd["エリア" + (i + 1)][j])|0;
                    }
                    d[i].push(t);
                  }
                  console.log(d)
                });
                await draw2(d, "人")
            }
          })();
        }

      });

    });
  })

})(this);
