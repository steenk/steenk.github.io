define(['tripledollar', 'read-n-replace'], function ($$$, rnr) {

	//	Controller

	var Binder = function () {
		var controller_id = 'controller_' + Math.random().toString(16).substr(2),
			bindings = {},
			_model,
			events = {};

		this.bind = function (view, model) {
			_model = model;
			/*
				The view has to be a unique instance and since
				JavaScript can't return a hashcode for an object,
				we have to do the next best thing and give it an ID.
				Nothing guarantees this is unique, so be careful.
			*/
			if (! view.id) {
				view.id = 'id_' + String(Math.random()).substr(2);
			}
			/*
				We want to mark the view as registres by this controller.
			*/
			view.classList.add(controller_id);
			/*
				Several view can be binded to the same model, so we
				keep track of all binded views.
			*/
			bindings[view.id] = {
				model: model,
				view: view
			};
			/*
				Register a change listener.
			*/
			view.evt('change', changed);
			/*
				Return the view for possible chaining.
			*/
			return view;
		}

		var pushToViews = this.pushToViews = function (target) {
			if (!target) return;
			var data = rnr.readData(target, _model);
			for (id in bindings) {
				/*
					If the push is initiated from a view, exclude it from the push.
				*/
				if (target && (id !== target.id)) {
					rnr.placeData(bindings[id].view, _model, data);
				}
			}
		}

		var getViewRoot = this.getViewRoot = function getViewRoot (target) {
			if (!target || (target && target.nodeName === 'BODY')) {
				return;
			}
			if (target.classList.contains(controller_id)) {
				return target;
			} else {
				return getViewRoot(target.parentNode);
			}
		}

		this.getViewData = function (target) {
			var view = this.getViewRoot(target);
			if (view) {
				return rnr.readData(view, _model);
			}
		}

		var changed = this.changed = function (evt) {
			var t = evt.target;
			/*
				The target is inside a view, and we need to find the root
				element in that view before we push the changes to other views.
			*/
			pushToViews(getViewRoot(t));
			dispatchEvent(evt);
		}

		function addEventListener (evtype, callback) {
			if (!events[evtype]) events[evtype] = [];
			var args = Array.prototype.slice.call(arguments);
			events[evtype].push(args.slice(1));
		}

		function dispatchEvent (event) {
			if (events[event.type]) {
				events[event.type].forEach(function (a) {
					$$$.setImmediate(function () {
						a[0].apply(undefined, [event].concat(a.splice(1)));
					})
				})
			}
		}

		Object.defineProperty(this, 'onchange',  {
			set: function (val) {
				addEventListener('change', val);
			}
		})

	}

	return Binder;

});