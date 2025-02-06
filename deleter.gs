var email_search = 'category:updates label:unread' 
function batchDeleteEmail() {
  try {
    processEmail(email_search, 'moveThreadsToTrash');
  }
  catch(error) {
    Logger.log(error)
    Logger.log('Re-trying...')
    batchDeleteEmail();
  }
}

function processEmail(search, batchAction) {
  var removed = 0;
  var batchSize = 100; // Process up to 100 threads at once
  var searchSize = 500; // Maximum search result size is 500

  var threads = GmailApp.search(search, 0, searchSize);
  var rando = 0;
  Logger.log('Found '+threads.length+' threads matching search: "'+search+'".')
  while (threads) {
    for (j = 0; j < threads.length; j += batchSize) {
      rando = Math.floor(Math.random() * 3000);
      Logger.log('Removing threads '+j+' to '+(j + batchSize)+'...');
      GmailApp[batchAction](threads.slice(j, j + batchSize));
      Logger.log('Sleeping for '+rando+' milliseconds.');
      Utilities.sleep(rando);
      removed += batchSize;
    }

    if ( ( removed % 2000 ) == 0 ) {
      rando = Math.floor(Math.random() * 40000);
      while ( rando < 20000 ) {
        rando = Math.floor(Math.random() * 40000);
      }
      Logger.log('Long sleeping for '+rando+' milliseconds.');
      Utilities.sleep(rando); // long sleep to try to keep api calls working...
    }

    threads = GmailApp.search(search, 0, searchSize);
    Logger.log('Total removed so far: '+removed+'.');
    Logger.log('Found '+threads.length+' more threads, removing...');
    
  }
}
