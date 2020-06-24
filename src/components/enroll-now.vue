<template lang="pug">
	div.widget-container(v-if="ready" )
		div(v-if="!showPlans")
			b-row
				b-col(cols="12")
					h3 Select Your State to Find the Right 529 Plan
					p.gray-font 529 plans allow investors to save for college and K-12 tuition tax-free. 30+ states also offer residents additional state tax breaks on contributions. Select your state to start.
					img
			b-row
				b-col(cols="12")
					.d-none.d-sm-block
						sfc-us-map(@click="mapClicked($event)" :selected-state-id="selectedStateId" :color-main="colorMain" :color-stroke="colorStroke")
					.d-block.d-sm-none
						select.select-state(v-model="selectedStateIdFromSelect" @change="clickFromSelect()")
							option(value="-" disabled) Select your state
							option(v-for="state of states" :value="state.string_id")
								| {{state.name}}
						span.arrow-down
		div(v-if="showPlans")
			b-row
				b-col(cols="12")
					a.return-link.pb-3.pb-sm-2(@click="clearState()")
						| Change state
			b-row
				b-col(cols="12")
					div(v-if="showEnrollNowPlusOnly")
						p.text-center(v-if="enrollNowPlusPlans[0].deduction_info.has_deduction || enrollNowPlusPlans[0].deduction_info.has_credit")
							| Congratulations! {{state.name}} offers a state tax {{enrollNowPlusPlans[0].deduction_info.has_deduction ? "deduction" : "credit"}} for contributing to your state's 529 plan.
						h4.text-center(v-if="!enrollNowPlusPlans[0].deduction_info.has_deduction && !enrollNowPlusPlans[0].deduction_info.has_credit")
							| Congratulations! It’s easy to save for college with a 529 plan from {{state.name}}.
						.plans-container
							.plans-header
								.logo
									| 529 Plan
								.ratings
									| Ratings
									span#performance-ratings-tooltip-1.icon-info(tabindex="1") ?
									b-tooltip(target="performance-ratings-tooltip-1" placement="left" triggers="click blur")
										.tooltip-info
											p
												| The 5-Cap Ratings represent our opinion of the attractiveness of each 529 plan, relative to all other 529 plans, based on the many factors that we feel are important.
											p
												| The fee score is derived from the analysis of costs done as part of Savingforcollege.com's 5-Cap Rating. This analysis compares total average asset-based expenses of the plan to other 529 savings plans.
											p
												| The performance score is derived from the analysis of performance as part of Savingforcollege.com’s 5-Cap Rating.
											p
												a(:href="`${sfcUrl}/5-cap-ratings/ratings-criteria`" target="_blank") More information
								.state
									| State
								.tax-benefit
									| State Tax Benefit
									span#tax-benefit-tooltip-1.icon-info(tabindex="0") ?
									b-tooltip(target="tax-benefit-tooltip-1" placement="left" triggers="click blur")
										.tooltip-info
											p
												| This is the maximum amount of annual contributions that can be claimed on a state tax return for a couple that is married filing jointly.
								.button
							.plans-content
								sfc-plan-card(v-if="plan.excluded_states_ids.indexOf(selectedStateId) == -1" v-for="plan of enrollNowPlusPlans" :plan="plan" :key="plan.id" :state-id="selectedStateId" @click="trackEnrollNowClick(plan)" :statePlan="statePlans[selectedStateId][0]")
								.plan-description(v-if="enrollNowPlusPlans.length == 1")
									.program-manager-logo
										img(:src="enrollNowPlusPlans[0].program_manager_logo_url")
									.description
										span.plan-name
											| {{enrollNowPlusPlans[0].name}}
										| {{enrollNowPlusPlans[0].description}}

					div(v-if="showEnrollNowOnly")
						h4.text-center
							| The state of {{state.name}} offers the following plan{{enrollNowPlans.length > 1 ? 's' : ''}}
						.plans-container.main
							.plans-header
								.logo
									| 529 Plan
								.ratings
									| Ratings
									span#performance-ratings-tooltip-2.icon-info(tabindex="1") ?
									b-tooltip(target="performance-ratings-tooltip-2" placement="left" triggers="click blur")
										.tooltip-info
											p
												| The 5-Cap Ratings represent our opinion of the attractiveness of each 529 plan, relative to all other 529 plans, based on the many factors that we feel are important.
											p
												| The fee score is derived from the analysis of costs done as part of Savingforcollege.com's 5-Cap Rating. This analysis compares total average asset-based expenses of the plan to other 529 savings plans.
											p
												| The performance score is derived from the analysis of performance as part of Savingforcollege.com’s 5-Cap Rating.
											p
												a(:href="`${sfcUrl}/5-cap-ratings/ratings-criteria`" target="_blank") More information
								.state
									| State
								.tax-benefit
									| State Tax Benefit
									span#tax-benefit-tooltip-2.icon-info(tabindex="0") ?
									b-tooltip(target="tax-benefit-tooltip-2" placement="left" triggers="click blur")
										.tooltip-info
											p
												| This is the maximum amount of annual contributions that can be claimed on a state tax return for a couple that is married filing jointly.
								.button
							.plans-content
								sfc-plan-card(v-if="plan.excluded_states_ids.indexOf(selectedStateId) == -1" v-for="plan of enrollNowPlans" :plan="plan" open-plan="true" :state-id="selectedStateId" @click="trackEnrollNowClick(plan)" :statePlan="statePlans[selectedStateId][0]")
						b-row(v-if="showPlans")
							b-col(cols="12")
								//- p.text-center Compare {{state.name}}'{{state.name.slice(-1) == 's' ? '' : 's'}} plan with other top-rated plans nationwide:
								p.text-center {{copySentence}}
								.plans-container
									.plans-header
										.logo
											| 529 Plan
										.ratings
											| Ratings
											span#performance-ratings-tooltip-3.icon-info(tabindex="1") ?
											b-tooltip(target="performance-ratings-tooltip-3" placement="left" triggers="click blur")
												.tooltip-info
													p
														| The 5-Cap Ratings represent our opinion of the attractiveness of each 529 plan, relative to all other 529 plans, based on the many factors that we feel are important.
													p
														| The fee score is derived from the analysis of costs done as part of Savingforcollege.com's 5-Cap Rating. This analysis compares total average asset-based expenses of the plan to other 529 savings plans.
													p
														| The performance score is derived from the analysis of performance as part of Savingforcollege.com’s 5-Cap Rating.
													p
														a(:href="`${sfcUrl}/5-cap-ratings/ratings-criteria`" target="_blank") More information
										.state
											| State
										.tax-benefit
											| State Tax Benefit
											span#tax-benefit-tooltip-3.icon-info(tabindex="0") ?
											b-tooltip(target="tax-benefit-tooltip-3" placement="left" triggers="click blur")
												.tooltip-info
													p
														| This is the maximum amount of annual contributions that can be claimed on a state tax return for a couple that is married filing jointly.
										
										.button
									.plans-content
										sfc-plan-card(v-for="plan of nationalPlans" :show-alternative-logo="true" :plan="plan" :key="plan.id" :state-id="selectedStateId" v-if="plan.excluded_states_ids.indexOf(selectedStateId) == -1 && !isStatePlan(plan)" @click="trackEnrollNowClick(plan)" :statePlan="statePlans[selectedStateId][0]")



					div(v-if="!showEnrollNowPlusOnly && !showEnrollNowOnly")
						h4.text-center(v-if="statePlans[selectedStateId].length > 0")
							| The state of {{state.name}} offers the following plan{{statePlans[selectedStateId].length > 1 ? 's' : ''}}
						.plans-container.main(v-if="statePlans[selectedStateId].length > 0")
							.plans-header
								.logo
									| 529 Plan
								.state
									| State
								.tax-benefit
									| State Tax Benefit
									span#tax-benefit-tooltip-4.icon-info(tabindex="0") ?
									b-tooltip(target="tax-benefit-tooltip-4" placement="left" triggers="click blur")
										.tooltip-info
											p
												| This is the maximum amount of annual contributions that can be claimed on a state tax return for a couple that is married filing jointly.
								.ratings
									| Ratings
									span#performance-ratings-tooltip-4.icon-info(tabindex="1") ?
									b-tooltip(target="performance-ratings-tooltip-4" placement="left" triggers="click blur")
										.tooltip-info
											p
												| The 5-Cap Ratings represent our opinion of the attractiveness of each 529 plan, relative to all other 529 plans, based on the many factors that we feel are important.
											p
												| The fee score is derived from the analysis of costs done as part of Savingforcollege.com's 5-Cap Rating. This analysis compares total average asset-based expenses of the plan to other 529 savings plans.
											p
												| The performance score is derived from the analysis of performance as part of Savingforcollege.com’s 5-Cap Rating.
											p
												a(:href="`${sfcUrl}/5-cap-ratings/ratings-criteria`" target="_blank") More information
								.button
							.plans-content
								sfc-plan-card(v-for="plan of statePlans[selectedStateId]" :plan="plan" :open-plan="false" :state-id="selectedStateId" :statePlan="statePlans[selectedStateId][0]")
						b-row(v-if="showPlans")
							b-col(cols="12")
								//- p.text-center(v-if="statePlans[selectedStateId].length > 0") Compare {{state.name}}'{{state.name.slice(-1) == 's' ? '' : 's'}} plan with other top-rated plans nationwide:
								//- p.text-center(v-if="statePlans[selectedStateId].length == 0") {{state.name}} doesn't offer a 529 plan. Compare top-rated plans nationwide below:
								p.text-center {{copySentence}}
								.plans-container
									.plans-header
										.logo
											| 529 Plan
										.state
											| State
										.tax-benefit
											| State Tax Benefit
											span#tax-benefit-tooltip-5.icon-info(tabindex="0") ?
											b-tooltip(target="tax-benefit-tooltip-5" placement="left" triggers="click blur")
												.tooltip-info
													p
														| This is the maximum amount of annual contributions that can be claimed on a state tax return for a couple that is married filing jointly.
										.ratings
											| Ratings
											span#performance-ratings-tooltip-5.icon-info(tabindex="1") ?
											b-tooltip(target="performance-ratings-tooltip-5" placement="left" triggers="click blur")
												.tooltip-info
													p
														| The 5-Cap Ratings represent our opinion of the attractiveness of each 529 plan, relative to all other 529 plans, based on the many factors that we feel are important.
													p
														| The fee score is derived from the analysis of costs done as part of Savingforcollege.com's 5-Cap Rating. This analysis compares total average asset-based expenses of the plan to other 529 savings plans.
													p
														| The performance score is derived from the analysis of performance as part of Savingforcollege.com’s 5-Cap Rating.
													p
														a(:href="`${sfcUrl}/5-cap-ratings/ratings-criteria`" target="_blank") More information
										.button
									.plans-content
										sfc-plan-card(v-for="plan of nationalPlans" :show-alternative-logo="true" :plan="plan" :key="plan.id" :state-id="selectedStateId" v-if="plan.excluded_states_ids.indexOf(selectedStateId) == -1 && !isStatePlan(plan)" @click="trackEnrollNowClick(plan)" :statePlan="statePlans[selectedStateId][0]")

			b-row
				b-col.pt-1.disclosure(cols="12")
					p
						| Rankings and ratings provided by&nbsp;
						a(:href="`${sfcUrl}`" target="_blank") Savingforcollege.com
						br
						a#advertiser-disclosure(href="javascript: void(0)")
							| Advertiser disclosure
						b-tooltip(target="advertiser-disclosure" placement="topright" triggers="click blur")
							.tooltip-info
								p
									| Before you invest, consider whether your or the beneficiary's home state offers any state tax or other benefits that are only available for investments in that state's 529 plan. Other state benefits may include financial aid, scholarship funds, and protection from creditors.
								p
									a(:href="`${sfcUrl}`" target="_blank") Savingforcollege.com
									| &nbsp;is the leading source of data on 529 plans. We may be compensated by partners; these relationships do not affect our rankings or ratings, which are grounded in thousands of hours of research. Our partners cannot pay us to guarantee favorable ratings or reviews of their products or services.

</template>


<style lang="stylus">
.tooltip-inner {
	max-width: 280px;
}
</style>


<style lang="stylus" scoped>
.disclosure {
	p {
		font-size: 10px;
		color: #AAA;

		a {
			color: #999;
		}
	}
}

.select-state {
	font-family: Rubik, sans-serif !important;
	font-size: 18px;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	box-shadow: none !important;
	background-color: transparent;
	border: 0;
	width: 95%;
	padding: 10px 15px;
	z-index: 41;
	border-radius: 5px;
	border: 1px solid #ababab;
}

.arrow-down {
	right: 13% !important;
}
.col-12
	padding-right: 5px !important;
	padding-left: 5px !important;

.plans-container {
	background-color: white;
	border: 1px solid #DEE2E7;
	border-radius: 5px;
	font-family: Rubik, sans-serif !important;

	@media screen and (min-width: 605px) {
		border: none;
	}

	&.main {
		margin-bottom: 20px;
	}

	.plans-header {
		display: none;
		background: #F1F5F8;
		color: #8B97A2 !important;
		text-transform: uppercase;
		margin-top: 15px;


		@media screen and (min-width: 605px) {
			display: flex;
			padding: 15px 0;
			font-size: 0.8rem;
			color: #212529;
			font-weight: 600;
			text-align: center;

			.logo {
				flex: 0 0 23%;
			}

			.state {
				flex: 0 0 8%;
			}

			.tax-benefit {
				flex: 0 0 25%;
			}

			.ratings {
				text-align: left;
				flex: 0 0 19%;
			}

			.button {
				flex: 0 0 25%;
			}

			&.no-deductions {
				.logo {
					flex: 0 0 25%;
				}

				.state {
					flex: 0 0 30%;
				}

				.tax-benefit {
					display: none;
				}

				.ratings {
					flex: 0 0 15%;
				}

				.button {
					flex: 0 0 25%;
				}
			}
		}

		@media screen and (min-width: 605px) and (max-width: 783px) {
			font-size: 0.7rem;
		}
	}

	.plans-content {
		> div {
			border-top: 1px solid #DEE2E7;


			&:first-child {
				border-top: 0 solid #DEE2E7;

				@media screen and (min-width: 605px) {
					border-top: 1px solid #DEE2E7;
				}
			}
		}

		.plan-description {
			padding: 20px;
			display: flex;

			@media (max-width: 604px) {
				display: block;
			}

			.program-manager-logo {
				flex-basis: 30%;
				align-self: center;

				@media (max-width: 604px) {
					text-align: center;
					flex-basis: 20%;
				}

				img {
					width: 100%;

					@media (max-width: 604px) {
						max-width: 100px;
					}
				}
			}

			.description {
				flex-basis: 70%;
				padding-left: 20px;
				font-family: Rubik, sans-serif !important;
				font-size: 13px;
				line-height: 1.5;

				@media (max-width: 604px) {
					margin-top: 30px;
					// text-align: center
				}

				span.plan-name {
					font-weight: bold;
					font-size: 14px;
					display: block;

					@media (max-width: 604px) {
						text-align: center;
						margin-bottom: 10px;
					}
				}
			}
		}
	}
}

.plans-container-same-sate {
	background-color: white;
	margin-bottom: 30px;
	border: none;
	border-radius: 5px;

	.plans-header {
		display: none;

		.logo {
				flex: 0 0 100%;
			}

		.state {
			flex: 0 0 25%;
		}

		.tax-benefit {
			flex: 0 0 25%;
		}

		.ratings {
			text-align: left;
			flex: 0 0 25%;
		}

		.button {
			flex: 0 0 100%;
		}

		@media screen and (min-width: 605px) {
			display: flex;
			justify-content: center;
			border-bottom: none;
			padding: 4px 0;
			font-size: 0.8rem;
			color: #212529;
			font-weight: 600;
			text-align: center;

			.logo {
				flex: 0 0 25%;
			}

			.tax-benefit {
				flex: 0 0 25%;
			}

			.button {
				flex: 0 0 25%;
			}
		}
	}
}

.icon-info {
	position: relative;
	display: inline-block;
	border-radius: 50%;
	background: none;
	border: #57636C 1px solid;
	color: #57636C;
	width: 15px;
	height: 15px;
	text-align: center;
	cursor: pointer;
	font-size: 9px;
	vertical-align: middle;
	margin-left: 4px;
	margin-top: -4px;
	padding-top: 1px;
}

.tooltip-info {
	p {
		font-size: 12px;
		line-height: 1.5;
		text-align: left;
		padding: 10px;
		margin: 0px;
	}
}

.widget-container {
	max-width: 900px;
	border: none;
	background: #FFFFFF;
	box-shadow: 0 2px 10px 0 rgba(36,36,36,0.20) !important;
	border-radius: 8px;	
	// background: #fbfbfb
	padding: 20px;
	margin: 30px auto;
	background-color: #fff;
	width:99%;
}

.return-link {
	float: right;
	cursor: pointer;
	margin-bottom: 12px;
	color: #1C97E1!important;
	padding: 8px 25px 8px 25px;
	border-radius: 8px;
	-webkit-transition: all 0.30s ease;
	moz-transition: all 0.30s ease;
	-o-transition: all 0.30s ease;
	transition: all 0.30s ease;
}

.return-link:hover {
	color: #125293 !important;
	background-color: #F1F5F8;
}

h6.title {
	font-size: 0.8rem;
	color: #212529;
	font-weight: 600;
}
</style>

<script>
import Vue from "vue";
import axios from "axios";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import SfcUsMap from "./sfc-us-map";
import SfcPlanCard from "./sfc-plan-card";
import { track, trackAnalyticsAction } from "../track";
import { queryParams } from "../query_params";

import "../assets/css/general.styl";

Vue.use(BootstrapVue);

export default {
	props: {
		statePlans: {},
		stateTaxes: {},
		nationalPlans: {},
		nonNationalPlans: {},
		company: { default: "Unkown" }
	},

	watch: {},

	components: {
		SfcUsMap,
		SfcPlanCard
	},

	created() {
		this.urlVars = queryParams();

		if (this.urlVars.colorMain) {
			this.colorMain = this.urlVars.colorMain;
		}
		if (this.urlVars.colorStroke) {
			this.colorStroke = this.urlVars.colorStroke;
		}
		if (this.urlVars.company) {
			this.localCompany = this.urlVars.company;
		}
	},

	mounted() {
		this.params = queryParams();
		if (this.urlVars.stateId) {
			if (this.urlVars.stateId == "auto") {
				const query = `
					query{
						no_graphql_cache()
						state_from_ip(){
							id
							sfc_id
							name
							slug
						}
					}
				`;

				axios
					.post(`${process.env.SFC_URL}/graphql`, { query })
					.then(response => {
						let responseState = response.data.data.state_from_ip;
						this.mapClicked(responseState.id);
						this.ready = true;
					});
			} else {
				let stateId = this.urlVars.stateId.toUpperCase();
				if (this.states.find(s => s.string_id == stateId)) {
					this.mapClicked(stateId);
					this.ready = true;
				}
			}
		} else {
			this.ready = true;
		}
		this.sendHeight();

		this.$nextTick(function() {
			window.addEventListener("resize", this.sendHeight())
		});
	},

	data() {
		let selectedStateId = undefined;

		let states = [
			{
				id: 1,
				name: "Alabama",
				string_id: "AL"
			},
			{
				id: 2,
				name: "Alaska",
				string_id: "AK"
			},
			{
				id: 3,
				name: "Arizona",
				string_id: "AZ"
			},
			{
				id: 4,
				name: "Arkansas",
				string_id: "AR"
			},
			{
				id: 5,
				name: "California",
				string_id: "CA"
			},
			{
				id: 6,
				name: "Colorado",
				string_id: "CO"
			},
			{
				id: 7,
				name: "Connecticut",
				string_id: "CT"
			},
			{
				id: 8,
				name: "Delaware",
				string_id: "DE"
			},
			{
				id: 9,
				name: "District of Columbia",
				string_id: "DC"
			},
			{
				id: 10,
				name: "Florida",
				string_id: "FL"
			},
			{
				id: 11,
				name: "Georgia",
				string_id: "GA"
			},
			{
				id: 12,
				name: "Hawaii",
				string_id: "HI"
			},
			{
				id: 13,
				name: "Idaho",
				string_id: "ID"
			},
			{
				id: 14,
				name: "Illinois",
				string_id: "IL"
			},
			{
				id: 15,
				name: "Indiana",
				string_id: "IN"
			},
			{
				id: 16,
				name: "Iowa",
				string_id: "IA"
			},
			{
				id: 17,
				name: "Kansas",
				string_id: "KS"
			},
			{
				id: 18,
				name: "Kentucky",
				string_id: "KY"
			},
			{
				id: 19,
				name: "Louisiana",
				string_id: "LA"
			},
			{
				id: 20,
				name: "Maine",
				string_id: "ME"
			},
			{
				id: 21,
				name: "Maryland",
				string_id: "MD"
			},
			{
				id: 22,
				name: "Massachusetts",
				string_id: "MA"
			},
			{
				id: 23,
				name: "Michigan",
				string_id: "MI"
			},
			{
				id: 24,
				name: "Minnesota",
				string_id: "MN"
			},
			{
				id: 25,
				name: "Mississippi",
				string_id: "MS"
			},
			{
				id: 26,
				name: "Missouri",
				string_id: "MO"
			},
			{
				id: 27,
				name: "Montana",
				string_id: "MT"
			},
			{
				id: 28,
				name: "Nebraska",
				string_id: "NE"
			},
			{
				id: 29,
				name: "Nevada",
				string_id: "NV"
			},
			{
				id: 30,
				name: "New Hampshire",
				string_id: "NH"
			},
			{
				id: 31,
				name: "New Jersey",
				string_id: "NJ"
			},
			{
				id: 32,
				name: "New Mexico",
				string_id: "NM"
			},
			{
				id: 33,
				name: "New York",
				string_id: "NY"
			},
			{
				id: 34,
				name: "North Carolina",
				string_id: "NC"
			},
			{
				id: 35,
				name: "North Dakota",
				string_id: "ND"
			},
			{
				id: 36,
				name: "Ohio",
				string_id: "OH"
			},
			{
				id: 37,
				name: "Oklahoma",
				string_id: "OK"
			},
			{
				id: 38,
				name: "Oregon",
				string_id: "OR"
			},
			{
				id: 39,
				name: "Pennsylvania",
				string_id: "PA"
			},
			{
				id: 40,
				name: "Rhode Island",
				string_id: "RI"
			},
			{
				id: 41,
				name: "South Carolina",
				string_id: "SC"
			},
			{
				id: 42,
				name: "South Dakota",
				string_id: "SD"
			},
			{
				id: 43,
				name: "Tennessee",
				string_id: "TN"
			},
			{
				id: 44,
				name: "Texas",
				string_id: "TX"
			},
			{
				id: 45,
				name: "Utah",
				string_id: "UT"
			},
			{
				id: 46,
				name: "Vermont",
				string_id: "VT"
			},
			{
				id: 47,
				name: "Virginia",
				string_id: "VA"
			},
			{
				id: 48,
				name: "Washington",
				string_id: "WA"
			},
			{
				id: 49,
				name: "West Virginia",
				string_id: "WV"
			},
			{
				id: 50,
				name: "Wisconsin",
				string_id: "WI"
			},
			{
				id: 51,
				name: "Wyoming",
				string_id: "WY"
			}
		];

		let state = "selected";

		return {
			selectedStateId,
			selectedStateIdFromSelect: "-",
			states,
			state,
			deduction: {},
			showPlans: false,
			openPlan: true,
			urlVars: {},
			colorMain: "a7d8a4",
			colorStroke: "000000",
			mode: "state_detect",
			ready: false,
			params: {},
			sfcUrl: process.env.SFC_URL
		};
	},

	methods: {
		isStatePlan(plan) {
			for (let enrollNowPlan of this.enrollNowPlans) {
				if (plan.id == enrollNowPlan.id) {
					return true;
				}
			}
			return false;
		},
		clearState() {
			track(
				"STATE_SELECT",
				"CHANGE_STATE",
				undefined,
				this.selectedStateId
			);
			this.sendHeight()
			this.showPlans = false;
			this.state = "selected";
		},

		clickFromSelect() {
			if (
				this.states.find(
					s => s.string_id == this.selectedStateIdFromSelect
				)
			) {
				this.mapClicked(this.selectedStateIdFromSelect);
			}
		},

		mapClicked(event) {
			if (event == undefined) {
				this.selectedStateId = this.state.string_id;
			} else {
				this.selectedStateId = event;
			}
			for (let index = 0; index < this.states.length; index++) {
				if (this.selectedStateId == this.states[index].string_id) {
					this.state = this.states[index];
					break;
				}
			}
			this.deduction = this.stateTaxes[this.state.string_id].deductions;
			track(
				"STATE_SELECT",
				this.isMobile() ? "MOBILE_DROPDOWN_CLICK" : "MAP_CLICK",
				undefined,
				this.selectedStateId
			);
			trackAnalyticsAction(
				"External Widgets",
				`${this.params.company || "Unknown"} - Enroll now 529 V2`,
				"State Click"
			);
			this.sendHeight();
			this.showPlans = true;
		},

		trackEnrollNowClick(plan) {
			if (plan.has_enroll_now_plus) {
				trackAnalyticsAction(
					"External Widgets",
					`${this.params.company || "Unknown"} - Enroll now 529 V2`,
					`Enroll Now Plus Click - ${plan.name}`
				);
			} else {
				trackAnalyticsAction(
					"External Widgets",
					`${this.params.company || "Unknown"} - Enroll now 529 V2`,
					`Enroll Now Click - ${plan.name}`
				);
			}
		},

		isMobile() {
			return document.documentElement.clientWidth < 768;
		},

		sendHeight(left = 5) {
			const appDiv = document.getElementById("app");
			window.top.postMessage(appDiv.scrollHeight + 10, "*");
			// console.log('appDiv.scrollHeight: ', appDiv.scrollHeight);
			setTimeout(() => {
				let appDiv2 = document.getElementById("app");
				window.top.postMessage(appDiv2.scrollHeight + 10, "*");
				// console.log('appDiv2.scrollHeight: ', appDiv2.scrollHeight);
				if (left > 0) {
					this.sendHeight(left - 1);
				}
			}, 200);
		},

		hasTaxBenefit(state) {
			if (state == "selected") return false;
			return this.stateTaxes[state.string_id].has_state_tax_deduction;
		}
	},

	computed: {
		copySentence(){
			if(this.statePlans[this.selectedStateId].length > 0){
				let plan = this.statePlans[this.selectedStateId][0]
				if(!plan.deduction_info.has_deduction && !plan.deduction_info.has_credit){
					return `${this.state.name} doesn't offer a state tax benefit. Consider these top-rated plans available to ${this.state.name} residents.`
				}else{
					if(plan.deduction_info.has_parity){
						return `Did you know? Your state tax benefit can be used with 529 plans from any state. Compare ${this.state.name}'${this.state.name.slice(-1) == 's' ? '' : 's'} plan with other top-rated plans nationwide:`
					}
					return `Remember that you can open plans from any state. Compare ${this.state.name}'${this.state.name.slice(-1) == 's' ? '' : 's'} plan with other top-rated plans nationwide:`
				}

			}
			return `${this.state.name} doesn't offer a 529 plan. Compare top-rated plans nationwide below:`
		},
		showEnrollNowPlusOnly(){
			let valueToReturn = false
			for(let plan of this.statePlans[this.selectedStateId]){
				if(plan.has_enroll_now_plus && plan.excluded_states_ids.indexOf(this.selectedStateId) == -1){
					valueToReturn = true
				}
			}
			return valueToReturn;
		},

		enrollNowPlusPlans() {
			let plans = [];
			for (let plan of this.statePlans[this.selectedStateId]) {
				if (plan.has_enroll_now_plus && plan.excluded_states_ids.indexOf(this.selectedStateId) == -1) {
					plans.push(plan);
				}
			}
			return plans;
		},

		showEnrollNowOnly() {
			let valueToReturn = false;
			for (let plan of this.statePlans[this.selectedStateId]) {
				if (plan.has_enroll_now) {
					valueToReturn = true;
				}
			}
			return valueToReturn && !this.showEnrollNowPlusOnly;
		},

		enrollNowPlans() {
			let plans = [];
			for (let plan of this.statePlans[this.selectedStateId]) {
				if (plan.has_enroll_now) {
					plans.push(plan);
				}
			}
			return plans;
		}
	}
};
</script>
