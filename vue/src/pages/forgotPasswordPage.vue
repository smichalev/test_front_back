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
						<v-toolbar-title>
							Восстановить пароль
						</v-toolbar-title>
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
					<v-alert color="error" text class="px-2 py-2 mb-0" v-if="listError.length">
						<div v-for="(error, index) in listError" :key="index">
							{{ error }}
						</div>
					</v-alert>
					<v-card-text v-if="step === 1">
						<v-text-field
							label="Email"
							name="email"
							type="text"
							v-model="email"
							required
							:error-messages="emailErrors"
							@input="$v.email.$touch()"
							@blur="$v.email.$touch()"
							:rules="emailRules"
						></v-text-field>
					</v-card-text>
					<v-card-text v-if="step === 2">
						<v-alert color="primary" text>
							Проверьте Ваш email и следуйте дальнейшим инструкциям из письма
						</v-alert>
					</v-card-text>
					<v-divider v-if="step === 1"></v-divider>
					<v-card-actions>
						<v-btn color="warning" elevation="0" block @click="next" v-if="step === 1" :loading="loaded">Восстановить
							пароль
						</v-btn>
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
			email: {required},
		},
		data() {
			return {
				listError: [],
				loaded: false,
				step: 1,
				email: null,
				emailRules: [
					v => !!v || 'Обязательное поле',
					v => /.+@.+\..+/.test(v) || 'Не правильный формат email',
				],
			};
		},
		methods: {
			next() {
				this.$v.$touch();
				this.listError = [];
				this.loaded = true;
				return this.$http.post(this.$address + '/forgot', {
						email: this.email,
					})
					.then(() => {
						this.loaded = false;
						this.step = 2;
					})
					.catch((err) => {
						this.loaded = false;
						this.listError.push(err.response.data.error.message);
					});
			},
			registration() {
				this.$router.push('/registration');
			},
			login() {
				this.$router.push('/login');
			},
			errorShow(filed) {
				const errors = [];

				if (!this.$v[filed].$dirty) {
					return errors;
				}

				if (!this.$v[filed].required) {
					errors.push('Обязательное поле');
				}

				return errors;
			},
		},
		computed: {
			emailErrors() {
				return this.errorShow('email');
			},
		},
	};
</script>
