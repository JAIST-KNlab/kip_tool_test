# 実行の方法

npm start

# 動かないときのメモ

+ とりあえずファイアウォールを全部止める

sudo systemctl stop firewalld.service

+ node_modules の中身を全部消してみる

+ npm audit fix　や　npm ci　をする

+ 不足分を自動ですべて補充する

sudo npm install -g npm-install-missing

npm-install-missing


bbb!!
