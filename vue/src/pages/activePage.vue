<template>
	<v-container
		class="fill-height"
		fluid
	>
		<v-row
			align="center"
			justify="center"
		>
			<v-col
				cols="12"
				sm="8"
				md="4"
			>
				<v-card class="elevation-12">
					<v-toolbar
						color="primary"
						dark
						flat
					>
						<v-toolbar-title>Активация аккаунта</v-toolbar-title>
					</v-toolbar>
					<v-alert color="error" text class="px-2 py-2 mb-0" v-if="listError.length">
						<div v-for="(error, index) in listError" :key="index">
							{{ error }}
						</div>
					</v-alert>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		data() {
			return {
				listError: [],
			};
		},
		mounted() {
			if (this.$router.currentRoute.query.hash) {
				return this.$http.get(this.$address + '/active?hash=' + this.$router.currentRoute.query.hash)
					.then((data) => {
						return this.$http.post(this.$address + '/active', {
								hash: data.data.result.code,
							})
							.then((data) => {
								this.$store.commit('LOGIN', data.data.result);
								this.$router.push('/');
							});
					})
					.catch((err) => {
						this.listError.push(err.response.data.error.message);
					});
			}
			else {
				this.listError.push('Ничего не найдено');
			}
		},
	};
</script>