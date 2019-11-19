((g) => {

  g.globalfreespace = g.globalfreespace || {};
  g.fnc = g.fnc || {};

  const datas = g.val;

  const hsla = g.fnc.hsla;
  const checkary = g.fnc.checkary;


  //時系列グラフの領域に描画
  //ただし，argsは[[index,数字の配列],[],...]
  g.fnc.draw1 = async (id, args, tani) => {
    let data = [];

    let d = document.getElementById(id);
    while (d.lastChild) {
      d.removeChild(d.lastChild);
    }
    await g.fnc.f(() => {
      //最初に空きなしにする．
      let argnew = [];
      for(let i = 0; i < args.length;i++){
        if(args[i].length > 0){
          argnew.push(args[i])
        }
      }
      args = argnew;
    });
    //console.log(args)
    await g.fnc.f(() => {
      for (let i = 0, tmp = []; i < args[0][1].length; i++, tmp = []) {
        tmp.push(args[0][1][i]);
        for (let j = 1; j < args.length; j++) {
          tmp.push(parseFloat(args[j][1][i]));
        }
        data.push(tmp);
      }
    });
    let index = []
    for (let i = 0; i < args.length; i++) {
      index.push(args[i][0])
    }
    data.unshift(index)

    //折れ線グラフ
    let dataset = [];
    let ticknumber = [];
    var timeparser = d3.timeParse("%Y-%m-%e %H:%M");
    var max;
    var min;

    for (let i = 1; i < data.length; i++) {
      dataset[i - 1] = [timeparser(data[i][0])];
      for (let a = 1; a < data[0].length; a++) {
        dataset[i - 1][a] = (data[i][a]);
      }
    }

    //console.log(data);
    var maxtime = Number(d3.max(dataset, function(d) {
      return d[0];
    }));
    var mintime = Number(d3.min(dataset, function(d) {
      return d[0];
    }));

    if (maxtime % 3600000 != 0) {
      maxtime = maxtime + 3600000;
    }

    maxtime = (maxtime) - (maxtime % 3600000);
    mintime = (mintime) - (mintime % 3600000);

    var timenum = (maxtime - mintime) / 3600000;


    for (let i = 0; i < timenum; i++) {
      var time = mintime + i * 3600000;
      if (((time / 3600000 + 9) % 24) == 9 || ((time / 3600000 + 9) % 24) == 17 /*|| i == 0 || i == timenum-1*/) {
        ticknumber.push(time);
      }
    }

    console.log(dataset[0][1]);

    max = min = dataset[0][1];
    for (let i = 1; i < data[0].length; i++) {
      if (max < d3.max(dataset, function(d) {
          return d[i];
        })) {
        max = d3.max(dataset, function(d) {
          return d[i];
        });
      }
      if (min > d3.min(dataset, function(d) {
          return d[i];
        })-2) {
        min = d3.min(dataset, function(d) {
          return d[i];
        })-2;
      }
    }
    console.log(min,max);
    var w = 800;
    var h = 469;
    var width = 400;
    var height = h;
    const padding = 50;

    const xScale = d3.scaleLinear()
      .domain([mintime, maxtime /*d3.min(dataset_1,function(d){ return d[0];}),d3.max(dataset_1,function(d){return d[0];})*/ ])
      .range([padding, w - padding]);
    const yScale = d3.scaleLinear()
      .domain([min, (max)])
      .range([h - padding, padding]);


    const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickValues(ticknumber)
      .tickFormat(d3.timeFormat("%e日%H時"));
    const yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(5);


    //var svg = d3.select("body")//d3.select("#"+id)
    var svg = d3.select("#" + id)
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    //g.globalfreespace.colorには上のマップの色あり
    let CA = [];
    for (let i = 0; i < (g.globalfreespace.color).length; i++) {
      if (g.globalfreespace.color[i] !== "hsl(0,0%,50%,0.5)") {
        CA.push(g.globalfreespace.color[i]); //グレー以外を取得
      }
    } //ここでCA.lengthがdatasetの種類数と等しくないのはsocketdoなどの間違い
    for (let i = 0; i < data[0].length - 1; i++) {
      svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", CA[i])
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) {
            return xScale(d[0]);
          })
          .y(function(d) {
            return yScale(d[i + 1]);
          })
        );
    }
  } //draw1


})(this);
