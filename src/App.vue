<template lang="pug">
	#app(v-observe-visibility="trackShownEvent")
		enroll-now-widget(:state-plans="plans" :state-taxes="taxes" :national-plans="nationalPlans" :non-national-plans="nonNationalPlans" v-if="ready")
</template>

<script>

import EnrollNowWidget from './components/enroll-now'
import axios from 'axios'
import {queryParams} from './query_params'
import {track, trackAnalyticsAction} from './track'
import Vue from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'

Vue.use(VueObserveVisibility)

export default {

	components: {
		EnrollNowWidget
	},

	data(){
		return{
			plans: [],
			nationalPlans: [],
			nonNationalPlans: [],
			taxes: {},
			ready: false,
			params: {},
			trackShownEventCalled: false
		}
	},

	methods: {
		trackShownEvent(isVisible, entry){
			if(isVisible && typeof(ga) == "function" && !this.trackShownEventCalled){
				if(!this.ready){
					setTimeout( () => {
						this.trackShownEvent(isVisible, entry)
					}, 200)
					return
				}
				this.trackShownEventCalled = true
				trackAnalyticsAction("External Widgets", `${this.params.company || "Unknown"} - Enroll now 529 V2`, "Shown")
				track("WIDGET","SHOWN")
			}
		},
		getData(){
			axios.get("https://webresources-savingforcollege.s3-us-west-2.amazonaws.com/data/tax_data.json", {}).then( taxResponse => {
					this.taxes = taxResponse.data.data.states_with_taxes
					axios.get(process.env.DATA_URL).then(response => {
						this.decode(response.data, true)
						this.ready = true
						trackAnalyticsAction("External Widgets", `${this.params.company || "Unknown"} - Enroll now 529 V2`, "Ready")
						track("WIDGET","READY")
					})
				}
			)
		},
		deductionInfo(stateStringId){
			const taxInfo = this.taxes

			let infoToReturn = {state_id: stateStringId}
			try{
				let singleData = taxInfo[stateStringId].deductions["Single"]
				let marriedData = taxInfo[stateStringId].deductions["Married Filing Jointly"]

				infoToReturn.single = {}
				infoToReturn.married = {}

				infoToReturn.single.deduction_amount = singleData.maximum_deductible_contribution
				infoToReturn.married.deduction_amount = marriedData.maximum_deductible_contribution

				infoToReturn.has_deduction = false
				if(infoToReturn.single.deduction_amount > 0){
					infoToReturn.has_deduction = true
				}

				infoToReturn.has_credit = false
				if(singleData.maximum_credit){
					infoToReturn.has_deduction = false
					infoToReturn.has_credit = true
					infoToReturn.credit_rate_for_deduction = singleData.percentage_for_deduction
					infoToReturn.single.credit_amount = singleData.maximum_credit
					infoToReturn.married.credit_amount = marriedData.maximum_credit

				}

				infoToReturn.has_deduction_per_account = false
				if(singleData.maximum_deductible_beneficiaries > 1){
					infoToReturn.has_deduction_per_account = true
				}

				infoToReturn.has_parity = false
				if(singleData.maximum_deductible_out_of_state != null){
					infoToReturn.has_parity = true
				}

				infoToReturn.has_unlimited_contributions = false
				if(singleData.maximum_deductible_contribution >= 999999999){
					infoToReturn.has_unlimited_contributions = true
				}
			}catch(e) {
				infoToReturn = {single:{}, married:{}}
			}
			return infoToReturn
		},

		sortingFunction(elementOne, elementTwo){
			if(elementOne.is_national && elementOne.has_enroll_now_plus){
					return -1
			}
			return 1
		},

		b64DecodeUnicode(input) {
			input = input.replace(/\s/g, '');
  			return atob(input);
		},

		decode(data, cyphered = true){
			let response = {}
			let decoded

			if (cyphered){
				decoded = this.b64DecodeUnicode(data)
				decoded = JSON.parse(decoded.substring(3,decoded.length-1)).data.states_without_territories
			}
			else{
				decoded = data.data.states_without_territories
			}


			for(let state of decoded){
				let deductionInfo = this.deductionInfo(state.id)
				for(let plan of state.direct_sold_plans){
					plan.deductions = this.taxes[state.id].deductions
					plan.has_state_tax_deduction = deductionInfo.has_deduction
					plan.has_tax_credits = deductionInfo.has_credit
					plan.deduction_info = deductionInfo
					plan.state_slug = state.slug
					if(plan.is_national){
						this.nationalPlans.push(plan)
					}
				}
				response[state.id] = state.direct_sold_plans
			}

			this.nationalPlans = this.nationalPlans.sort(this.sortingFunction)

			this.plans = response

		}
	},

	mounted(){
		this.params = queryParams()
		track("WIDGET","LOAD");
		trackAnalyticsAction("External Widgets", `${this.params.company || "Unknown"} - Enroll now 529 V2`, "Loaded")
		this.getData()
	}

}
</script>

