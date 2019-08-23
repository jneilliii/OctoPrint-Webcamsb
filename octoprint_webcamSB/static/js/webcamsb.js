/*
 * View model for OctoPrint-Webcamsb
 *
 * Author: Luis Magar Brunner
 * License: AGPLv3
 */
$(function() {
	function WebcamSBViewModel(parameters) {
		var self = this;
		self.settings = parameters[0];
		self.expanded_cam = ko.observable(false);
		self.current_cam_url = ko.observable('');
		self.current_cam_name = ko.observable('');
		self.getByName = function(name) {
			return ko.utils.arrayFirst(self.settings.settings.plugins.webcamSB.urls(), function(item) {
				return item.name() === name;
			}) || {name:ko.observable('Default'),url:self.settings.webcam_streamUrl};
		};

		self.onAfterBinding = function() {
			self.wcsbChangeCam();
		};

		self.wcsbChangeCam = function(data) {
			var camera = self.getByName(self.settings.settings.plugins.webcamSB.defaultCam());
			var camera_url = camera.url();
			camera_url += (camera_url.indexOf('?') < 0) ? '?' : '&';
			camera_url += new Date().getTime();
			self.current_cam_url(camera_url);
			self.current_cam_name(camera.name());
		}

		self.wcsbPOC = function(data) {
			if (self.settings.settings.plugins.webcamSB.expand() == 1) {
				$('div#webcsb_large').modal("show");
			}
		}

		self.webcamsb_add_cam = function() {
			self.settings.settings.plugins.webcamSB.urls.push({name:ko.observable(''),url:ko.observable('')});
		}

		self.webcamsb_remove_cam = function(data) {
			self.settings.settings.plugins.webcamSB.urls.remove(data);
		}
	};

	OCTOPRINT_VIEWMODELS.push({
		construct: WebcamSBViewModel,
		dependencies: ["settingsViewModel"],
		elements: ["#sidebar_plugin_webcamSB_wrapper","div#webcsb_large","#settings_plugin_webcamSB"]
	});
});
