<template lang="pug">
	.plan-container
		.logo(v-if="plan.openPlan || openPlan")
			a(:href="enrollNowUrl(plan)" target="_blank" @click="track('LOGO', plan)")
				img(v-if="plan.alternative_logo_url && showAlternativeLogo" :src="plan.alternative_logo_url")
				img(v-else :src="plan.logo_url")
		.logo(v-else)
			img(:src="plan.logo_url")
		.ratings
			.full
				.label
					| Overall Rating
				span.icon-info(tabindex="1" :id="overallRatingId") ?
				b-tooltip(:target="overallRatingId" placement="top" triggers="click blur")
					.tooltip-info
						p
							| The 5-Cap Ratings represent our opinion of the attractiveness of each 529 plan, relative to all other 529 plans, based on the many factors that we feel are important.
						p
							| The fee score is derived from the analysis of costs done as part of Savingforcollege.com's 5-Cap Rating. This analysis compares total average asset-based expenses of the plan to other 529 savings plans.
						p
							| The performance score is derived from the analysis of performance as part of Savingforcollege.com’s 5-Cap Rating.
						p
							a(:href="`${sfcUrl}/5-cap-ratings/ratings-criteria`" target="_blank") More information
				.score-box(v-if="statePlan")
					img(:src="`//web-resources.savingforcollege.com/images/cap-ratings/rating-caps-${plan.state_id == statePlan.state_id ? plan.five_caps_resident : plan.five_caps_non_resident}.svg`")
				.score-box(v-else)
					img(:src="`//web-resources.savingforcollege.com/images/cap-ratings/rating-caps-${plan.five_caps_non_resident}.svg`")
			.half.hide-mobile
				.label(v-if="plan.five_year_performance_five_star_score")
					| Performance
				.score-box(v-if="plan.five_year_performance_five_star_score")
					img(:src="`//web-resources.savingforcollege.com/images/${plan.five_year_performance_five_star_score}-Star.svg`")
			.half.hide-mobile
				.label(v-if="plan.fees_five_star_score")
					| Fee Score
				.score-box(v-if="plan.fees_five_star_score")
					img(:src="`//web-resources.savingforcollege.com/images/${plan.fees_five_star_score}-Star.svg`")
		
		.state
			.label
				| State
			| <strong>{{plan.state_id}}</strong>
		.tax-benefit
			.label
				| State tax benefit
				span.icon-info(tabindex="0" :id="stateRatingId") ?
				b-tooltip(:target="stateRatingId" placement="top" triggers="click blur")
					.tooltip-info
						p
							| This is the maximum amount of annual contributions that can be claimed on a state tax return for a couple that is married filing jointly.
			| <strong> {{taxDeduction(plan)}}</strong>
		
		.button(v-if="plan.openPlan || openPlan")
			a.btn.sfc-blue(:href="enrollNowUrl(plan)" target="_blank" @click="track('BUTTON', plan)")
				| OPEN PLAN
			//- a.btn.sfc-blue(:href="planDetailsUrl(plan)" target="_blank" v-if="!plan.openPlan")
				| LEARN MORE
</template>

<style lang="stylus" scoped>
body
	font-family: 'Rubik', sans-serif;


.plan-container
	text-align: center
	display: flex
	flex-wrap: wrap
	font-family: 'Rubik', sans-serif;
	align-items: center
	@media screen and (min-width: 605px)
		align-items: top

	.logo
		flex: 0 0 30%
		clear: both
		img
			padding: 5px 0px 0px 0px
			width: 100%
			max-width: 90px
	.state
		flex: 0 0 56%
		font-size: 13px;
		color: #8B97A2
		background: #F1F5F8
		text-align: left
		font-weight: 500;
		padding-left: 10px
		padding-top: 10px
		margin-left: 10px
		margin-top: 5px
		display: flex
		border-radius: 4px 4px 0px 0px
		@media screen and (min-width: 605px)
			
			background: #fff
		.label
			font-size: 13px;
			padding-bottom: 5px
		
	strong 
		margin-left: 10px
		color: #212529

	.tax-benefit
		flex: 56% 0 0
		font-size: 13px;
		color: #8B97A2;
		text-align: left
		background: #F1F5F8
		display: flex
		font-weight: 500;
		padding: 5px 0px 5px 10px
		margin-left: 10px
		margin-bottom: 10px;
		height: 35px;
		border-radius: 0px 0px 4px 4px
		.label
			font-size: 13px;
			padding-bottom: 10px
		
		@media screen and (min-width: 605px) and (max-width: 783px)
			font-size: 20px
		@media screen and (min-width: 605px)
			background: #ffffff
	.ratings
		flex: 0 0 70%
		padding: 12px 0px 5px 20px
		display: flex;
	.full
		width: 100%;
		display flex
			
		@media screen and (min-width: 605px)
			width: 100%
			display: inline-block

		.label
			font-weight: 500
			font-size: 12px;
			margin: 0
			padding: 0
			@media screen and (max-width: 605px)
				display: inline-block
		.score-box
			margin-bottom: 5px
			img
				width: 85%
				max-width: 130px
				margin-bottom: 9px
				padding-top: 1px
	.half
		width: 33%;
		padding: 0px 5px;
		clear: none;
		float: left;
		@media screen and (max-width: 605px)
			width: 100%;

	.button
		flex: -20 0 100%
		margin: -20px 0 10px 15px
		font-size: 8px
		// margin: 15px 0 25px 0

	@media screen and (min-width: 605px)
		flex-wrap: nowrap
		.plan-container
			

		.logo
			flex: 0 0 23%

			img
				width: 95%
				max-width: 170px;
		.state
			display: block
			font-size: 26px;
			color: #212529;
			font-weight: 500;
			text-align: center
			flex: 0 0 8%
			padding-left: 0px
			padding-top: 0px
			margin-bottom: 0px

			.label
				display: none
			padding-bottom: 0px
			@media screen and (min-width: 605px) and (max-width: 783px)
				font-size: 20px
			
			
		.tax-benefit
			flex: 0 0 20%
			text-align: center
			font-size: 21px;
			.label
				display: none
			padding-bottom: 0px
		.ratings
			flex: 0 0 19%
			text-align: left
			display inline-block

			.score-box
				margin-bottom: 0
				img
					width: 60%
					margin-bottom: 5px
		.button
			flex: 0 0 25%
			text-align: center
			align-items: center
			align-content: center
			font-size: 12px
		.half
			display: inline-block;
			width: 100%;
			padding: 0px;



.icon-info
			position: relative
			display: inline-block
			border-radius: 50%
			background: none
			color: #57636C
			border: #57636C 1px solid
			width: 15px
			height: 15px
			text-align: center
			cursor: pointer
			font-size: 9px
			vertical-align: middle
			margin-left: 4px
			@media screen and (min-width: 605px)
				display: none

.tooltip-info
	p
		font-size: 12px
		line-height: 1.5
		text-align: left
		padding: 2px 5px
		margin: 0px
</style>

<script>
import Vue from "vue";
import '../assets/css/general.styl';
import {track} from '../track'
import {queryParams} from '../query_params'

export default {
	props: {
		"plan": {
			default: {},
			type: Object,
			required: true
		},
		openPlan: {
			default: true
		},

		stateId: {
			default: "-"
		},

		statePlan:{
			default: null
		},

		showAlternativeLogo: {
			default: false
		}

	},
	data(){
		let stateRatingId = `state-rating-${Math.floor(Math.random()*1000000)}`
		let overallRatingId = `overall-rating-${Math.floor(Math.random()*1000000)}`
		return {
			stateRatingId,
			overallRatingId,
			params: {},
			sfcUrl: process.env.SFC_URL
		}
	},
	mounted(){
		this.params = queryParams()
	},
	methods:{

		track(from='BUTTON', plan){
			if (plan.has_enroll_now_plus) {
				track("PLAN", `${from}_CLICK_PLUS`, plan.id, plan.state_id, { plan_name: plan.name, selected_state_id: this.stateId })
			} else {
				track("PLAN", `${from}_CLICK`, plan.id, plan.state_id, { plan_name: plan.name, selected_state_id: this.stateId })
			}

			this.$emit('click')
		},

		enrollNowUrl(plan){
			let clickSource = "enroll-now-widget-v2"

			if(plan && plan.id && plan.has_enroll_now_plus){
				for(let enroll_now_plus_url of plan.enroll_now_plus_urls){
					if(enroll_now_plus_url.publisher == this.params.company){
						return enroll_now_plus_url.url
					}
				}
				// Fallback
				return plan.enroll_now_plus_urls[0].url
			}

			if(plan && plan.id && plan.has_enroll_now){
				return plan.enroll_now_url
			}

			return `${process.env.SFC_URL}/529-plans/${plan.state_slug}/${plan.slug}`
		},
		planDetailsUrl(plan){
			return `${process.env.SFC_URL}/529-plans/${plan.state_slug}/${plan.slug}`
		},
		taxDeduction(plan){
			if(!this.statePlan){
				return "N/A"
			}

			if(!this.statePlan.deduction_info.has_deduction && !this.statePlan.deduction_info.has_credit){
				return "N/A"
			}

			if(this.statePlan.deduction_info.has_parity){
				if(this.statePlan.deduction_info.has_unlimited_contributions){
					return "Unlimited"
				}else{
					return `$${this.formatPrice(this.statePlan.deduction_info.married.deduction_amount)}/yr`
				}
			}

			if(this.statePlan.id == plan.id){
				if(this.statePlan.deduction_info.has_deduction){
					if(this.statePlan.deduction_info.has_unlimited_contributions){
						return "Unlimited"
					}else{
						return `$${this.formatPrice(this.statePlan.deduction_info.married.deduction_amount)}/yr`
					}
				}

				if(this.statePlan.deduction_info.has_credit){
					return `$${this.formatPrice(this.statePlan.deduction_info.married.credit_amount)}/yr`
				}
			}

			return "N/A"
		},
		formatPrice(value) {
			let val = (value/1).toFixed(0).replace('.', ',')
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},
	}
}
</script>


