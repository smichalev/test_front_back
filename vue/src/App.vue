<template>
	<v-app>
		<v-content>
			<router-view></router-view>
			<github></github>
		</v-content>
	</v-app>
</template>

<script>
	import github from './components/github';

	export default {
		name: 'App',
		components: {
			github,
		},
		mounted() {
			this.$http.get(this.$address + '/profile')
				.then((data) => {
					if (!data.data.profile && this.$route.path === '/') {
						this.$router.push('/login');
					}

					if (data.data.profile.login) {
						this.$store.commit('LOGIN', data.data.profile);
						this.$router.push('/');
					}
				});
		},
	};
</script>

<style lang="scss" scoped>
	body {
		background: #f0f8ff;
	}
</style>

