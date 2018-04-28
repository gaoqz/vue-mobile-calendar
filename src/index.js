import Vue from 'vue';
import Page from './index.vue';

new Vue({
    el: '#app',
    data: {},
    render: createElement => createElement(Page, {})
});
