const myApp = s5.initialize();

myApp.require(['auth'], auth => auth.start());