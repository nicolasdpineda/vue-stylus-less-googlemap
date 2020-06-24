var iframeWrapper = document.createElement('div');

var responsiveDiv = document.createElement('div');
responsiveDiv.setAttribute("class", "sfc-psw-responsive-container");

var getVars = {};
var uri = document.scripts[document.scripts.length-1].src.split("?");
if (uri.length == 2) {
	var vars = uri[1].split("&");
	var tmp = "";
	for (var i = 0; i < vars.length; i++) {
		const element = vars[i];
		tmp = element.split("=");
		if (tmp.length == 2) getVars[tmp[0]] = tmp[1];
	}
}

var url = "https://sfc-external-widgets.savingforcollege.com/enroll_now_529_v2/index.html?origin=collegeinvestor&colorMain=5F9ABC&colorStroke=f2f2f2&company=collegeinvestor";
if(getVars.stateId) {
	url = url + "&stateId=" + getVars.stateId;
}

var container = document.createElement('iframe');
script = document.scripts[document.scripts.length - 1];
container.setAttribute("src", url);
container.setAttribute("frameborder", 0);
container.setAttribute("width", "100%");
container.setAttribute("height", "100%");
container.setAttribute("class", "sfc-psw-responsive-iframe");

var responsiveStyleTag = document.createElement('style');
responsiveStyleTag.innerText = ".sfc-psw-responsive-container { width: 100%; min-height: 300px; }; .sfc-psw-responsive-iframe {position: absolute;top: 0;left: 0;width: 100%;height: 100%;}";
responsiveDiv.appendChild(container);
iframeWrapper.appendChild(responsiveDiv);
iframeWrapper.appendChild(responsiveStyleTag);

script.parentElement.insertBefore(iframeWrapper, script);

window.addEventListener('message', function(e) {
	var scroll_height = e.data;
	document.getElementsByClassName('sfc-psw-responsive-container')[0].style.height = scroll_height + 'px';
} , false);
