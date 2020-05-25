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
						<v-toolbar-title>Восстановить пароль</v-toolbar-title>
					</v-toolbar>
					<div class="row mx-2">
						<div class="col-sm">
							<v-btn elevation="0" color="primary" @click="login" text block>Войти</v-btn>
						</div>
						<div class="col-sm">
							<v-btn elevation="0" color="success" @click="registration" text block>Зарегистрироваться</v-btn>
						</div>
					</div>
					<v-divider></v-divider>
					<v-card-text>
						<v-form>
							<v-text-field
								label="Email"
								name="email"
								type="text"
							></v-text-field>
						</v-form>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn color="warning" elevation="0" block>Восстановить пароль</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		name: 'forgot__password',
		methods: {
			login() {
				this.$router.push('/login');
			},
			registration() {
				this.$router.push('/registration');
			},
		},
		mounted() {
			if (this.$store.state.profile) {
				this.$router.push('/');
			}
		},
	};
</script>
