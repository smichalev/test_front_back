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
						<v-toolbar-title>Ваш профиль</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-list-item two-line v-if="profile">
							<v-list-item-content v-if="profile._id">
								<v-list-item-title>ID</v-list-item-title>
								<v-list-item-subtitle>{{ profile._id }}</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
						<v-list-item two-line v-if="profile">
							<v-list-item-content>
								<v-list-item-title>Активность</v-list-item-title>
								<v-list-item-subtitle>
									<v-chip v-if="profile.active" label color="success" small>Активен</v-chip>
									<v-chip v-else label color="error" small>Не активен</v-chip>
								</v-list-item-subtitle>
								<v-list-item-subtitle v-if="!profile.active" class="mt-2">
									Для активации проверьте свой почтовый адрес.
								</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
						<v-list-item two-line v-if="profile">
							<v-list-item-content v-if="profile.login">
								<v-list-item-title>Email</v-list-item-title>
								<v-list-item-subtitle>{{ profile.login }}</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
						<v-list-item two-line v-if="profile">
							<v-list-item-content v-if="profile.name">
								<v-list-item-title>Имя</v-list-item-title>
								<v-list-item-subtitle>{{ profile.name }}</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
						<v-list-item two-line v-if="profile">
							<v-list-item-content v-if="profile.surname">
								<v-list-item-title>Фамилия</v-list-item-title>
								<v-list-item-subtitle>{{ profile.surname }}</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn color="error" elevation="0" block @click="logout">Выйти</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		name: 'index',
		mounted() {
			if (!this.$store.state.auth.profile) {
				this.$router.push('/login');
			}
		},
		methods: {
			registration() {
				this.$router.push('/registration');
			},
			forgot__password() {
				this.$router.push('/forgot');
			},
			logout() {
				return this.$http.post(this.$address + '/logout')
					.then(() => {
						this.$store.commit('LOGOUT');
						this.$router.push('/login');
					});
			},
		},
		computed: {
			profile() {
				return this.$store.state.auth.profile;
			},
		},
	};
</script>