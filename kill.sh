NODE_SERVER_PID=($(ps -ef | grep '\snode server.js' | sed -n 2p));
sudo kill ${NODE_SERVER_PID[1]};
echo 'killed node server.js. pid:';
echo ${NODE_SERVER_PID[1]};

