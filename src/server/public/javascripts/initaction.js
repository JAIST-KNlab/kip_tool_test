(g => {
  g.globalfreespace = g.globalfreespace || {};
  g.fnc = g.fnc || {};
  const f = g.fnc.f;
  const datas = g.val;
  const hsla = g.fnc.hsla;
  const checkary = g.fnc.checkary;

  g.addEventListener('load', () => {
    (async () => {
      
      g.fnc.maindraw({
        name: "",
        metric: [9],
        weight: [1]
      })

      /*document.getElementById("subtitle").innerHTML = "平均人数";

      let d = [0, 0, 0, 0, 0, 0, 0, 0, 0],
        dd = datas.data3;
      await g.fnc.f(() => {
        for (let i = 0; i < d.length; i++) {
          d[i] = dd["エリア" + (i + 1)]
        }
      });
      await g.fnc.draw2(d, "人")

      await g.fnc.draw1("chart2", [
        ["日時", datas.data3.timestamps],
        ["エリア1", datas.data3["エリア1"]],
        [],
        ["エリア3", datas.data3["エリア3"]],
        [],
        ["エリア9", datas.data3["エリア9"]]
      ]);*/
    })();

  });


})(this)
