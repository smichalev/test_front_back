import Vue from 'vue';
import Router from 'vue-router';

import indexRouter from './indexRouter';
import loginRouter from './loginRouter';
import registrationRouter from './registrationRouter';
import forgotPasswordRouter from "./forgotPasswordRouter";
import resetRouter from "./resetRouter";
import activeRouter from "./activeRouter";

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		...indexRouter,
		...loginRouter,
		...registrationRouter,
		...forgotPasswordRouter,
		...resetRouter,
		...activeRouter,
	],
});
