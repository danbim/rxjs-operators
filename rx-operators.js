var Rx = require('rx');

var timeoutScheduler    = Rx.Scheduler.timeout;
var AnonymousObservable = Rx.AnonymousObservable;
var CompositeDisposable = Rx.CompositeDisposable;

Rx.Observable.prototype.slidingWindowWithTime = function(windowSizeMs, scheduler) {
	
	var source = this;
	Rx.helpers.isScheduler(scheduler) || (scheduler = timeoutScheduler);

	return new AnonymousObservable(function(observer) {

		var group = new CompositeDisposable();
		var done = false;
		var buffer = [];

		group.add(source.subscribe(
			function (value) {
				buffer = buffer.slice().concat(value);
				observer.onNext(buffer);
				var schedule = scheduler.scheduleWithRelative(windowSizeMs, function() {
					if (buffer.length > 0) {
						buffer = buffer.slice(1);
						observer.onNext(buffer);
						group.remove(schedule);
						schedule = null;
					}
					done && observer.onCompleted();
				});

				group.add(schedule);
			},
			observer.onError.bind(observer),
			function () {
				done = true;
				group.length === 1 && observer.onCompleted();
			}
		));

	    return group;
	});
}

Rx.Observable.prototype.slidingWindowAverageWithTime = function(windowSizeMs, scheduler) {

	var source = this;
	Rx.helpers.isScheduler(scheduler) || (scheduler = timeoutScheduler);

	return new AnonymousObservable(function(observer) {

		var group = new CompositeDisposable();
		var done = false;
		var sum = undefined;
		var cnt = 0;
		
		group.add(source.subscribe(
			function (value) {
				sum = sum === undefined ? value : sum+value;
				cnt++;
				observer.onNext(sum === undefined ? undefined : sum / cnt);
				var schedule = scheduler.scheduleWithRelative(windowSizeMs, function() {
					if (cnt > 0) {
						cnt--;
						sum = cnt == 0 ? undefined : sum - value;
						observer.onNext(sum === undefined ? undefined : sum / cnt);
						group.remove(schedule);
						schedule = null;
					}
					done && observer.onCompleted();
				});

				group.add(schedule);
			},
			observer.onError.bind(observer),
			function () {
				done = true;
				group.length === 1 && observer.onCompleted();
			}
		));

	    return group;
	});

}

module.exports = {
	slidingWindowWithTime : Rx.Observable.prototype.slidingWindowWithTime,
	slidingWindowAverageWithTime : Rx.Observable.prototype.slidingWindowAverageWithTime
}
