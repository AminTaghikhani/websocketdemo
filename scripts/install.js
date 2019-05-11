var Service = require('node-windows').Service;
// Create a new service object
var svc = new Service({
  name:'Escape Room',
  description: 'Escape Room Server',
  script: require('path').join(__dirname,'..', 'bin','www'),
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

// Just in case this file is run twice.
svc.on('alreadyinstalled',function(){
  console.log('This service is already installed.');
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start',function(){
  console.log(svc.name+' started!\nVisit http://127.0.0.1:2380 to see it in action.');
});

// Install the script as a service.
svc.install();
