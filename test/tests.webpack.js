var context = require.context('./unit/', true, /.+\.js$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);
context = require.context('../lib/', true, /.+\.js$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);
