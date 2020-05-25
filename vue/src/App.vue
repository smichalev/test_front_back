<template>
	<v-app>
		<router-link to="/">Главная</router-link>
		<router-link to="/login">Логин</router-link>
		<router-link to="/registration">Регистрация</router-link>
		<router-link to="/forgot__password">Восстановить пароль</router-link>
		<router-view></router-view>
	</v-app>
</template>

<script>

	export default {
		name: 'App',
		components: {},
		mounted() {
			console.log('123');
		},
	};
</script>

<style>

</style>
