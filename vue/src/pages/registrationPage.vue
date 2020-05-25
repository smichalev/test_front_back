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
						<v-toolbar-title>Регистрация</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn elevation="0" @click="loginURL" color="primary">Войти</v-btn>
					</v-toolbar>
					<v-alert color="error" text class="px-2 py-2 mb-0" v-if="listError.length">
						<div v-for="(error, index) in listError" :key="index">
							{{ error }}
						</div>
					</v-alert>
					<v-form>
						<v-card-text>
							<v-text-field
								:error-messages="emailErrors"
								@input="$v.login.$touch()"
								@blur="$v.login.$touch()"
								label="Email"
								name="email"
								type="text"
								v-model="login"
								required
								:rules="emailRules"
							></v-text-field>
							<v-text-field
								:error-messages="passwordErrors"
								@input="$v.password.$touch()"
								@blur="$v.password.$touch()"
								label="Пароль"
								name="password"
								type="password"
								v-model="password"
								required
								:rules="rules"
							></v-text-field>
							<v-text-field
								:error-messages="repeat_passwordErrors"
								@input="$v.repeat_password.$touch()"
								@blur="$v.repeat_password.$touch()"
								label="Повторите пароль"
								name="repeat_password"
								type="password"
								v-model="repeat_password"
								required
								:rules="rules"
							></v-text-field>
						</v-card-text>
						<v-divider></v-divider>
						<v-card-text>
							<v-text-field
								:error-messages="nameErrors"
								@input="$v.name.$touch()"
								@blur="$v.name.$touch()"
								label="Ваше имя"
								name="name"
								type="text"
								v-model="name"
								required
								:rules="rules"
							></v-text-field>
							<v-text-field
								:error-messages="surnameErrors"
								@input="$v.surname.$touch()"
								@blur="$v.surname.$touch()"
								label="Ваша фамилия"
								name="surname"
								type="text"
								required
								v-model="surname"
								:rules="rules"
							></v-text-field>
						</v-card-text>
					</v-form>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn color="success" elevation="0" block @click="registrationAccount">Регистрация</v-btn>
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
		name: 'registration',
		data() {
			return {
				listError: [],
				login: null,
				password: null,
				repeat_password: null,
				name: null,
				surname: null,
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
			loginURL() {
				this.$router.push('/login');
			},
			registrationAccount() {
				this.$v.$touch();
				this.listError = [];
				this.$http.post(this.$address + '/registration', {
						login: this.login,
						password: this.password,
						repeat_password: this.repeat_password,
						name: this.name,
						surname: this.surname,
					})
					.then((data) => {
						this.$store.commit('LOGIN', data.data.profile);
						this.$router.push('/');
					})
					.catch((err) => {
						this.listError.push(err.response.data.error.message);
					});
			},
			errorShow(filed, type) {
				const errors = [];
				if (!this.$v[filed].$dirty) {
					return errors;
				}
				if (!this.$v[filed].required) {
					errors.push('Обязательное поле');
				}

				if (type) {
					if (type === 'password' || type === 'repeat_password') {
						if(!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(this.password) || !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(this.repeat_password)) {
							errors.push('Пароль должен быть не меньше 8 символов с заглавными и прописными буквами');
						}

						if (this.password !== this.repeat_password) {
							errors.push('Пароли не совпадают');
						}
					}
				}
				return errors;
			},
		},
		mounted() {
			if (this.$store.state.profile) {
				this.$router.push('/');
			}
		},
		computed: {
			emailErrors() {
				return this.errorShow('login');
			},
			passwordErrors() {
				return this.errorShow('password', 'password');
			},
			repeat_passwordErrors() {
				return this.errorShow('password', 'repeat_password');
			},
			nameErrors() {
				return this.errorShow('name');
			},
			surnameErrors() {
				return this.errorShow('surname');
			},
		},
	};
</script>
