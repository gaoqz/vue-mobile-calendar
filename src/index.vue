<template>
	<div>
		<div class="cell" @click="showCalendar">展示日历</div>

		<calendar v-if="canShowCalendar"
		:selected-day="'2018-04-04'"
		:main-color="'#06C1AE'"
		:can-select-last="true"
		:can-select-future="true"
		@year-changed="yearChanged"
		@month-changed="monthChanged"
		@date-changed="dateChanged"
		@cover-click="onCoverClick"></calendar>
	</div>
</template>
<script>
import calendar from './calendar.vue';

export default {
  components: {
    calendar
  },
	data() {
		return {
			canShowCalendar: false
		}
	},
  methods: {
		showCalendar() {
			this.canShowCalendar = true;
		},
		yearChanged(year) {
			console.log(`current year: ${year}`);
		},
		monthChanged(month) {
			console.log(`current month: ${month}`);
		},
		dateChanged(date) {
			console.log(`current date: ${date}`);
			this.canShowCalendar = false;
		},
		onCoverClick() {
			this.canShowCalendar = false;
		}
  }
}
</script>
<style lang="scss">
.cell {
	width: 80%;
	height: 60px;
	border-radius: 4px;
	margin-left: 10%;
	margin-top: 10%;
	font-size: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	background: #06C1AE;
}
</style>

