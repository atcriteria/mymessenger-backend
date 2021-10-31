# MyMessenger - Back End

## About

The back end to host the WebSockets for the MyMessenger Application. The application itself uses the Socket.io library to send and listen to activity on WebSockets. The back end caches the previous 25 messages in the event that a new user connects during an active conversation or a user refreshes their browser page. This is to prevent the need for a database as well as allow for some continuity in sessions because users tend to like that kind of stuff. The back end also scans received messages to see if the current sender is the same as the previous sender, and if so to concatinate those messages rather than to send every message as a separate message. Again, this is another feature users come to expect from instant messaging applications and it was a fun feature to implement.

## Goals

There are no future goals with this project at this time. 
