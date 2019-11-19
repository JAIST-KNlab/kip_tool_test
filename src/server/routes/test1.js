var express = require('express');
var d3 = require("d3");
const fs = require('fs');
const csv = require('csv');

var router = express.Router();

let sendData = [0, 0, 0, 0];
let path = ['/data/sensor1.csv', '/data/sensor2.csv', '/data/floorNum.csv', '/data/NumFeel.csv']
const f = async f => {
  return f()
};
const transpose = a => a[0].map((_, c) => a.map(r => r[c]));

let _loop = (i) => {
  if (i < sendData.length) {
    fs.createReadStream(__dirname + path[i]).pipe(csv.parse((err, data) => {
      let dd = {};
      data = transpose(data)
      for (let i = 0; i < data.length; i++) {
        dd[data[i][0]] = data[i].slice(1)
      }
      sendData[i] = dd;
      if (i < sendData.length) {
        i += 1;
        _loop(i);
      }

    }));
  }
}

_loop(0);

router.get('/', function(req, res, next) {
  let sends = [];

  (async () => {
    //tomestamp 処理
    await f(() => {
      let dd = sendData[0];
      for (let i = 0, tmp; i < dd.timestamps.length; i++) {
        tmp = new Date(dd.timestamps[i]);
        //console.log(dd[i].timestamps)
        dd.timestamps[i] = tmp.getFullYear() + "-" + (tmp.getMonth() + 1) + "-" + tmp.getDate() + " " + tmp.getHours() + ":" + tmp.getMinutes();
      }
      sendData[0] = dd;
    })

    await f(() => {
      let dd = sendData[1];
      for (let i = 0, tmp; i < dd.timestamps.length; i++) {
        tmp = new Date(dd.timestamps[i]);
        //console.log(dd[i].timestamps)
        dd.timestamps[i] = tmp.getFullYear() + "-" + (tmp.getMonth() + 1) + "-" + tmp.getDate() + " " + tmp.getHours() + ":" + tmp.getMinutes();
      }
      sendData[1] = dd;
    })

    await f(() => {
      let dd = sendData[2];
      for (let i = 0, tmp; i < dd.timestamps.length; i++) {
        tmp = new Date(dd.timestamps[i]);
        //console.log(dd[i].timestamps)
        dd.timestamps[i] = tmp.getFullYear() + "-" + (tmp.getMonth() + 1) + "-" + tmp.getDate() + " " + tmp.getHours() + ":" + tmp.getMinutes();
      }
      sendData[2] = dd;
    })

    await f(() => {
      let dd = sendData[3];
      for (let i = 0, tmp; i < dd.timestamps.length; i++) {
        tmp = new Date(dd.timestamps[i]);
        //console.log(dd[i].timestamps)
        dd.timestamps[i] = tmp.getFullYear() + "-" + (tmp.getMonth() + 1) + "-" + tmp.getDate() + " " + tmp.getHours() + ":" + tmp.getMinutes();
      }
      sendData[3] = dd;
    })

    await f(() => {
      res.render('test1', {
        data1: sendData[0],
        data2: sendData[1],
        data3: sendData[2],
        data4: sendData[3],
      });
    })

  })();



  /*(async () => {
    await (async () => {
      //console.log(dd)
      await new Promise(resolve => {
        for(let i = 0,t = [],tmp;i < dd.length;i++,t = []){
          tmp = new Date(dd[i].timestamps);
          //console.log(dd[i].timestamps)
          t.push(tmp.getFullYear() + "-" + (tmp.getMonth() + 1) + "-" + tmp.getDate() + " " + tmp.getHours() + ":" + tmp.getMinutes())
          t.push(dd[i][key]);
          sends.push(t)
        }
        //console.log(sends)
        view();
      });
      return;
    })();
  })();*/



});

module.exports = router;
