
((g) => {

  g.globalfreespace = g.globalfreespace || {};
  g.fnc = g.fnc || {};

  const datas = g.val;

  const hsla = g.fnc.hsla;
  const checkary = g.fnc.checkary;

  g.addEventListener('load', () => {
    ///{“metric”:[1,2,3], weight:[1,1,2]}

    //実験として描画
    (async () => {
      let x = datas.data1.timestamps;
      //await draw1("chart2",["日時",x],["騒音[dB]",datas.data1["騒音[dB]"]],["温度[℃]",datas.data1["温度[℃]"]]);
      await g.fnc.draw1("chart2", ["日時", x], ["エリア4の温度[℃]", datas.data1["温度[℃]"]], ["エリア6の温度[℃]", datas.data2["温度[℃]"]]);
      //await draw1(x, datas.data1["温度[℃]"], "日時", "温度[℃]", "chart2");
    })();

    (async () => {
      let d = [0, 0, 0, 0, 0, 0, 0, 0, 0],
        dd = datas.data3;
      await g.fnc.f(() => {
        for (let i = 0; i < d.length; i++) {
          d[i] = dd["エリア" + (i + 1)]
        }
      });
      await g.fnc.draw2(d, "人")
    })();
  });




  //時系列グラフの領域に描画
  //ただし，argsは[[index,数字の配列],[],...]
  g.fnc.draw1 = async (id, ...args) => {
    let data = [];

    await g.fnc.f(() => {
      for (let i = 0, tmp = []; i < args[0][1].length; i++, tmp = []) {
        tmp.push(args[0][1][i]);
        for (let j = 1; j < args.length; j++) {
          tmp.push(args[j][1][i] | 0);
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
    var timeparser = d3.timeFormat("%Y-%m-%e-%H-%M");
    console.log(data);


    for (let i = 1; i < data.length; i++) {
      dataset[i - 1] = [(data[i][0]), (data[i][1])];
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


    var svg = d3.select("body")//"#"+
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

  }//draw1


})(this);
