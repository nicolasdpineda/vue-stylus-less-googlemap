import axios from 'axios';

let track = (target = "PAGE", event_type = "LOAD", plan_id = undefined, state_id = undefined, details = undefined) => {
	if (window){
		let getVars = {}
		let uri = window.location.href.split("?")
		if (uri.length == 2) {
			let vars = uri[1].split("&")
			let tmp = ""
			vars.forEach(function(v) {
				tmp = v.split("=");
				if (tmp.length == 2) getVars[tmp[0]] = tmp[1]
			});
		}

		let origin = getVars.origin || getVars.company || location.href

		let payload =  {
			widget: "enroll_now_529_v2",
			origin,
			source: location.href,
			target,
			event_type
		}

		if (plan_id) {
			payload.plan_id = plan_id
		}
		if (state_id) {
			payload.state_id = state_id
		}
		if (details) {
			payload.details = details
		}
		try{
			axios.post(`${process.env.SFC_URL}/external-widget/event`, payload)
		}
		catch(err){
			console.log("No Tracking")
		}

	}

}

let trackAnalyticsAction = (category, action, label, nonInteraction = 1) => {
	ga('send', 'event', category, action, label, {'nonInteraction': nonInteraction})
}

export {
	track,
	trackAnalyticsAction
}

