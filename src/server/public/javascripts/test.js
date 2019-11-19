var common = {
  socket: null
};



((g) => {

  g.addEventListener('load', () => {
    //common.socket = io.connect();
    //common.socket.on('key', function(data) {
      //if(data && ){
      //  draw(id,...);
      //}



    let data=[];
    let tmp;
    (async () => {
      await (async () => {
        await new Promise(resolve => {
          for(let i = 0;i < g.data.length; i++){
            tmp = new Date(g.data[i].timestamps);
            //console.log(tmp.getFullYear() + "-" + (tmp.getMonth() + 1) + "-" + tmp.getDate() + " " + tmp.getHours() + ":" + tmp.getMinutes())
            data.push({date:tmp.getFullYear() + "-" + (tmp.getMonth() + 1) + "-" + tmp.getDate() + " " + tmp.getHours() + ":" + tmp.getMinutes(),value:g.data[i]["温度[℃]"]});
          }
          draw(data);
        });
        return;
      })();
    })();
  });

  const draw = (datas) => {
    // 表示サイズを設定
    var margin = {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40
    };

    var size = {
      width: 800,
      height: 400
    };

    // 時間のフォーマット
    var parseDate = d3.time.format("%Y-%m-%d %H:%M").parse;
    //console.log(datas)
    let data = datas;


    // SVG、縦横軸などの設定
    var svg = d3.select("#chart2")
      .attr("width", size.width)
      .attr("height", size.height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.time.scale()
      .range([0, size.width - margin.left - margin.right]);

    var y = d3.scale.linear()
      .range([size.height - margin.top - margin.bottom, 0])
    //  .ticks(5);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format("%Y-%m-%d"));

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.value);
      });


    // 描画
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
    });

    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));
    y.domain(d3.extent(data, function(d) {
      return d.value;
    }));

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + (size.height - margin.top - margin.bottom) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".7em")
      .style("text-anchor", "end")
      .text("℃");

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  }



})(this);
