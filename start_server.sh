cd /root/server
npm install
npm run build
if [ $DEV ];then npm run dev;else npm start;fi