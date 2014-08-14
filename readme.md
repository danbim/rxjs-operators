# RxJS-Operators

This repository contains a couple of operators for the reactive programming library RxJS (https://github.com/Reactive-Extensions/RxJS)
that I use in my own projects and which might be of use for others.

## Usage

Assuming you're building an application based on node.js extend the Rx prototype by adding the following lines:

```
Rx.Observable.prototype.slidingWindowWithTime        = require('rx-operators').slidingWindowWithTime;
Rx.Observable.prototype.slidingWindowAverageWithTime = require('rx-operators').slidingWindowAverageWithTime;
```

## License

```
----------------------------------------------------------------------------
"THE BEER-WARE LICENSE" (Revision 42):
<daniel@bimschas.com> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return Daniel Bimschas
----------------------------------------------------------------------------
```