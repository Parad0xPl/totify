# Totify

Simple communication bridge between clients and telegram. Using sockets is simple way for other clients to send notification. Current version support only one way communication (from client to telegram) but it should be possible to implement registering command. Protocol is based on queue where elements are separated with semicolons. 

## Build

```
npm install
npm run build
```

## Start

```
npm start
```

## Protocol Operations

### register (name)
Reply with "\<id\>&\<auth\>"

```
register;Test App;
```

### login (authcode)
Reply with "OK" on success or "ERR" with message;
```
login;PIZS-4681-bKUp-2154;
```

### notify (msg)
Need authentication
Reply with "OK" on success or "ERR" with message;
```
notify; test notification;
```

### ping
Reply with pong
```
ping;
```

### close
Reply with closing message and close connection
```
close;
```

## Communication Sample
```
Server in: register;Test App;close;
Server out: 5&GSFBT-665-oJDDKqerYCWwfmtFWOOD;
```

```
Server in: login;EDSPG-466-VlyoDV9i6mBOAwle0hZU;ping;notify;Test;close;
Server out: OK;pong;OK;Closing connection;
```

```
Server in: login;invalid-code;
Server out: ERR;auth unmatched or not activated;
```

```
Server in: notify;notify without login;
Server out: ERR;need to be logged;
```