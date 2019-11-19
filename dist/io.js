
var common  = common || { socket : null };

((g) => {
  window.addEventListener('load',()=>{
    common.socket = io.connect();
    common.socket.on('connect', (data) => {
      common.socket.emit('test', "マッシュアップ接続完了");
    });
  })
})(this);
