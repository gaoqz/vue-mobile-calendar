<template>
  <div class="paotui-callendar">
    <div class="cal-wrapper animated slideInDown">
      <div class="cal-header">
        <div class="btn-l" @click="preMonth"><div class="arrow-left icon">&nbsp</div></div>
        <div class="title">{{curYearMonth}}</div>
        <div class="btn-r" @click="nextMonth"><div class="arrow-right icon">&nbsp</div></div>
      </div>
      <div class="cal-body">
        <div class="weeks">
          <span v-for="(dayName, dayIndex) in defaultParams.dayNames" class="item" :key="dayIndex">
            {{defaultParams.dayNames[dayIndex % 7]}}
          </span>
        </div>
        <div class="dates">
          <div v-for="date in dayList" class="date-item" :key="date.date">
            <p class="date-num" 
            v-if="date.status === 1 || date.status === 2"
            :class="{'active': dateSelect === date.fullDate, 'disabled': date.status === 2}"
            @click="handleChangeCurday(date)">
              {{date.date.split('-')[2]}}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="cal-cover" @click="coverClick"></div>
  </div>
</template>

<script>
function dateTimeFormatter (date ,format) {
  date = new Date(date)
  if (!date || date.toUTCString() == "Invalid Date") {
    return ""
  }

  var map = {
    "M": date.getMonth() + 1, //月份
    "d": date.getDate(), //日
    "h": date.getHours(), //小时
    "m": date.getMinutes(), //分
    "s": date.getSeconds(), //秒
    "q": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  }

  format = format.replace(/([yMdhmsqS])+/g, function(all, t){
    var v = map[t]
    if(v !== undefined){
      if(all.length > 1){
        v = '0' + v
        v = v.substr(v.length-2)
      }
      return v
    }
    else if(t === 'y'){
      return (date.getFullYear() + '').substr(4 - all.length)
    }
    return all
  })

  return format
}

export default {
  name: 'vue-calendar',
  data () {
    let dateObj = new Date();
    return {
      defaultParams: {
        dayNames: ['一', '二', '三', '四', '五', '六', '日'],
        format : 'yyyy-MM',
        fullFormat: 'yyyy-MM-dd'
      },
      calendar: {
        options: {
          color: '#f29543'
        },
        params: {
          curYear: dateObj.getFullYear(),
          curMonth: dateObj.getMonth(),
          curDate: dateObj.getDate(),
        }
      },
      dateSelect: null
    }
  },
  props: {
    selectedDay: {
      type: String,
      required: false
    }
  },
  computed: {
    dayList() {
      let firstDay = new Date(this.calendar.params.curYear, this.calendar.params.curMonth, 1);
      let dayOfWeek = firstDay.getDay();
      // 根据当前日期计算偏移量
      if (dayOfWeek <= 0) {
        dayOfWeek = dayOfWeek + 6;
      } else {
        dayOfWeek = dayOfWeek - 1;
      }

      let startDate = new Date(firstDay);
      startDate.setDate(firstDay.getDate() - dayOfWeek);
      
      let item, status, tempArr = [], tempItem, futureItem;
      for (let i = 0 ; i < 42; i++) {
          item = new Date(startDate);
          item.setDate(startDate.getDate() + i);

          if (this.calendar.params.curMonth === item.getMonth()) {
            status = 1;
            if (this.calendar.params.curDate < item.getDate()) {
              status = 2;
            }
          } else if (this.calendar.params.curMonth > item.getMonth()) {
            if (this.calendar.params.curYear < item.getFullYear()) {
              status = 3
            } else {
              status = 0;
            }
          } else {
            status = 3;
          }
          tempItem = {
            date: `${item.getFullYear()}-${(item.getMonth()+1)}-${item.getDate()}`,
            status: status,
            fullDate: dateTimeFormatter(item ,this.defaultParams.fullFormat)
          }
          tempArr.push(tempItem);
      }
      futureItem = tempArr.filter(item => item.status === 3);
      if (futureItem.length >= 7 && futureItem.length < 14) {
        tempArr = tempArr.slice(0, 35);
      } else if (futureItem.length >= 14) {
        tempArr = tempArr.slice(0, 28);
      }
      return tempArr;
    },
    today() {
      let dateObj = new Date();
      return `${dateObj.getFullYear()}/${dateObj.getMonth()+1}/${dateObj.getDate()}`
    },
    curYearMonth() {
      let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth+1}/01`));
      return dateTimeFormatter(tempDate, this.defaultParams.format);
    },
    customColor() {
      return this.calendar.options.color;
    }
  },
  mounted() {
    this.dateSelect = this.selectedDay;
  },
  methods: {
    nextMonth() {
      if (this.calendar.params.curMonth < 11) {
        this.calendar.params.curMonth++;
      } else {
        this.calendar.params.curYear++;
        this.calendar.params.curMonth = 0;
      }
      this.$emit('month-changed', this.curYearMonth);
    },
    preMonth() {
      if (this.calendar.params.curMonth > 0) {
        this.calendar.params.curMonth--;
      } else {
        this.calendar.params.curYear--;
        this.calendar.params.curMonth = 11;
      }
      this.$emit('month-changed', this.curYearMonth);
    },
    handleChangeCurday(date) {
      if (date.status === 1) {
        this.dateSelect = date.fullDate;
        this.$emit('cur-day-changed', date.date);
      }
    },
    coverClick() {
      this.$emit('cover-click');
    }
  }
}
</script>
<style lang="scss">
@function px2rem($px, $base-rem-size: 75px) {
    @if (unitless($px)) {
        @return px2rem($px + 0px); // That may fail.
    }
    @else if (unit($px)==rem) {
        @return $px;
    }
    @return ($px / $base-rem-size) * 1rem;
}

@mixin hairline($position, $color) {
    @if $position==top {
        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: auto;
            right: auto;
            height: 1px;
            width: 100%;
            background-color: $color;
            display: block;
            z-index: 15;
            transform-origin: 50% 0%;
            @media only screen and (-webkit-min-device-pixel-ratio: 2) {
                transform: scaleY(0.5);
            }
            @media only screen and (-webkit-min-device-pixel-ratio: 3) {
                transform: scaleY(0.33);
            }
        }
    }
    @else if $position==left {
        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: auto;
            right: auto;
            width: 1px;
            height: 100%;
            background-color: $color;
            display: block;
            z-index: 15;
            transform-origin: 0% 50%;
            @media only screen and (-webkit-min-device-pixel-ratio: 2) {
                transform: scaleX(0.5);
            }
            @media only screen and (-webkit-min-device-pixel-ratio: 3) {
                transform: scaleX(0.33);
            }
        }
    }
    @else if $position==bottom {
        &:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            right: auto;
            top: auto;
            height: 1px;
            width: 100%;
            background-color: $color;
            display: block;
            z-index: 15;
            transform-origin: 50% 100%;
            @media only screen and (-webkit-min-device-pixel-ratio: 2) {
                transform: scaleY(0.5);
            }
            @media only screen and (-webkit-min-device-pixel-ratio: 3) {
                transform: scaleY(0.33);
            }
        }
    }
    @else if $position==right {
        &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            left: auto;
            bottom: auto;
            width: 1px;
            height: 100%;
            background-color: $color;
            display: block;
            z-index: 15;
            transform-origin: 100% 50%;
            @media only screen and (-webkit-min-device-pixel-ratio: 2) {
                transform: scaleX(0.5);
            }
            @media only screen and (-webkit-min-device-pixel-ratio: 3) {
                transform: scaleX(0.33);
            }
        }
    }
}

body {
  padding: 0;
  margin: 0;
}

.cal-wrapper {
  position: absolute;
  top: 0;
  background-color: #fff;
  z-index: 10500;

  .cal-header {
    display: flex;
    height: px2rem(90);
    align-items: center;
    position: relative;
    @include hairline(bottom, #C4C4C4);

    .title {
      flex: 1;
      text-align: center;
      font-size: px2rem(30);
    }
  }

  .cal-body {
    .weeks {
      padding-top: px2rem(30);
      display: flex;

      span {
        text-align: center;
        width: px2rem(750/7);
        color: #999;
      }
    }

    .dates {
      display: flex;
      flex-flow: wrap;
      align-items: stretch;
      justify-content: space-between;
      margin-top: px2rem(20);

      .date-item {
        width: px2rem(750/7);
        height: px2rem(80);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .date-num {
        display: flex;
        align-items: center;
        justify-content: center;
        width: px2rem(60);
        height: px2rem(60);
        border-radius: 50%;
        font-size: px2rem(30);
        &.active {
          background: #06C1AE;
          color: #fff;
        }
        &.disabled {
          color: #999;
        }
      }
    }
  }
}

.cal-cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10300;
  opacity: 1;
}

p {
  padding: 0;
  margin: 0;
}

.slideInDown {
  animation-name: slideInDown;
}

.animated {
  animation-duration: 300ms;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

@keyframes slideInDown {
  from {
    transform: translate(0%, -00%);
    visibility: visible;
  }

  to {
    transform: translate3d(0%, 0);
  }
}
</style>
