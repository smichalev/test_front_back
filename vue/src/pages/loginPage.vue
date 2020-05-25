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
						<v-toolbar-title>Авторизация</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn elevation="0" color="primary" @click="registration">Зарегистрироваться</v-btn>
					</v-toolbar>
					<v-alert color="error" text class="px-2 py-2 mb-0" v-if="listError.length">
						<div v-for="(error, index) in listError" :key="index">
							{{ error }}
						</div>
					</v-alert>
					<v-card-text>
						<v-form>
							<v-text-field
								label="Email"
								name="email"
								type="text"
								v-model="login"
								required
								:error-messages="emailErrors"
								@input="$v.login.$touch()"
								@blur="$v.login.$touch()"
								:rules="emailRules"
							></v-text-field>
							<v-text-field
								id="password"
								label="Пароль"
								name="password"
								type="password"
								v-model="password"
								required
								:error-messages="passwordErrors"
								@input="$v.password.$touch()"
								@blur="$v.password.$touch()"
								:rules="rules"
							></v-text-field>
						</v-form>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn color="error" text @click="forgot__password">Забыли пароль?</v-btn>
						<v-spacer></v-spacer>
						<v-btn color="success" elevation="0" :disabled="activeBtn" @click="authorization">Войти</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import {validationMixin} from 'vuelidate';
	import {required} from 'vuelidate/lib/validators';

	export default {
		mixins: [validationMixin],
		validations: {
			login: {required},
			password: {required},
			repeat_password: {required},
			name: {required},
			surname: {required},
		},
		name: 'login',
		data() {
			return {
				listError: [],
				login: null,
				password: null,
				rules: [
					v => !!v || ('Обязательное поле'),
				],
				emailRules: [
					v => !!v || 'Обязательное поле',
					v => /.+@.+\..+/.test(v) || 'Не правильный формат email',
				],
			};
		},
		methods: {
			authorization() {
				this.$v.$touch();
				this.listError = [];
				return this.$http.post(this.$address + '/login', {
						login: this.login,
						password: this.password,
					})
					.then((data) => {
						if (data.data.profile) {
							this.$store.commit('LOGIN', data.data.profile);
							this.$router.push('/');
						}
					})
					.catch((err) => {
						this.listError.push(err.response.data.error.message);
					});
			},
			registration() {
				this.$router.push('/registration');
			},
			forgot__password() {
				this.$router.push('/forgot');
			},
			errorShow(filed, type) {
				const errors = [];

				if (!this.$v[filed].$dirty) {
					return errors;
				}

				if(type) {
					if(type === 'password') {
						if(!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(this.password)) {
							errors.push('Пароль должен быть не меньше 8 символов с заглавными и прописными буквами');
						}
					}
				}

				if (!this.$v[filed].required) {
					errors.push('Обязательное поле');
				}

				return errors;
			},
		},
		computed: {
			emailErrors() {
				return this.errorShow('login');
			},
			passwordErrors() {
				return this.errorShow('password', 'password');
			},
		},
		mounted() {
			if (this.$store.state.profile) {
				this.$router.push('/');
			}
		},
	};
</script>