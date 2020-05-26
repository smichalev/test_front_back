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
						<v-toolbar-title>Восстановление пароля</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-toolbar-title><v-btn @click="$router.push('/login')" text color="primary" small>Логин</v-btn></v-toolbar-title>
					</v-toolbar>
					<v-alert color="error" text class="px-2 py-2 mb-0" v-if="listError.length">
						<div v-for="(error, index) in listError" :key="index">
							{{ error }}
						</div>
					</v-alert>
					<v-card-text v-if="found">
						<v-text-field
							label="Старый пароль"
							name="oldpassword"
							type="password"
							v-model="oldpassword"
							required
							:error-messages="oldpasswordErrors"
							@input="$v.oldpassword.$touch()"
							@blur="$v.oldpassword.$touch()"
							:rules="rules"
						></v-text-field>
						<v-text-field
							label="Новый пароль"
							name="newpassword"
							type="password"
							v-model="newpassword"
							required
							:error-messages="newpasswordErrors"
							@input="$v.newpassword.$touch()"
							@blur="$v.newpassword.$touch()"
							:rules="rules"
						></v-text-field>
						<v-text-field
							label="Повторите новый пароль"
							name="repeat_newpassword"
							type="password"
							v-model="repeat_newpassword"
							required
							:error-messages="repeat_newpasswordErrors"
							@input="$v.repeat_newpassword.$touch()"
							@blur="$v.repeat_newpassword.$touch()"
							:rules="rules"
						></v-text-field>
					</v-card-text>
					<v-divider v-if="found"></v-divider>
					<v-card-actions v-if="found">
						<v-btn color="success" elevation="0" block @click="changePassword">Сменить пароль</v-btn>
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
			oldpassword: {required},
			newpassword: {required},
			repeat_newpassword: {required},
		},
		data() {
			return {
				found: false,
				listError: [],
				idTarget: null,
				codeTarget: null,
				oldpassword: null,
				newpassword: null,
				repeat_newpassword: null,
				rules: [
					v => !!v || ('Обязательное поле'),
				],
			};
		},
		mounted() {
			if (this.$router.currentRoute.query.hash) {
				return this.$http.get(this.$address + '/reset?hash=' + this.$router.currentRoute.query.hash)
					.then((data) => {
						this.idTarget = data.data.result.user;
						this.codeTarget = data.data.result.code;
						this.found = true;
					})
					.catch((err) => {
						this.listError.push(err.response.data.error.message);
					});
			}
			else {
				this.listError.push('Ничего не найдено');
			}
		},
		methods: {
			changePassword() {
				this.$v.$touch();
				this.listError = [];
				return this.$http.post(this.$address + '/reset', {
						userid: this.idTarget,
						oldpassword: this.oldpassword,
						newpassword: this.newpassword,
						repeat_newpassword: this.repeat_newpassword,
						hash: this.codeTarget,
					})
					.then((data) => {
						this.$store.commit('LOGIN', data.data.profile);
						this.$router.push('/');
					})
					.catch((err) => {
						this.listError.push(err.response.data.error.message);
					});
			},
			errorShow(filed) {
				const errors = [];

				if (!this.$v[filed].$dirty) {
					return errors;
				}

				if(filed === 'oldpassword') {
					if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(this.oldpassword)) {
						errors.push('Пароль должен быть не меньше 8 символов с заглавными и прописными буквами');
					}
				}

				if(filed === 'newpassword') {
					if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(this.newpassword)) {
						errors.push('Пароль должен быть не меньше 8 символов с заглавными и прописными буквами');
					}

					if (this.newpassword !== this.repeat_newpassword) {
						errors.push('Пароли не совпадают');
					}
				}

				if(filed === 'repeat_newpassword') {
					if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(this.repeat_newpassword)) {
						errors.push('Пароль должен быть не меньше 8 символов с заглавными и прописными буквами');
					}

					if (this.newpassword !== this.repeat_newpassword) {
						errors.push('Пароли не совпадают');
					}
				}

				if (!this.$v[filed].required) {
					errors.push('Обязательное поле');
				}

				return errors;
			},
		},
		computed: {
			oldpasswordErrors() {
				return this.errorShow('oldpassword');
			},
			newpasswordErrors() {
				return this.errorShow('newpassword');
			},
			repeat_newpasswordErrors() {
				return this.errorShow('repeat_newpassword');
			},
		},
	};
</script>