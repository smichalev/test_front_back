const CODES = {
	UNKNOWN_ERROR: 0,
	NOT_FOUND: 1,
	NOT_CORRECT_QUERY: 2,
	USER_IS_ALREADY_THERE: 3,
	BAD_PASSWORD_OR_LOGIN: 4,
	PASSWORD_MISMATCH: 5,
	REQUIRED_FIELD: 6,
	NOT_VALID_EMAIL: 7,
	NOT_VALID_PASSWORD: 8,
	NOT_FOUND_USER: 9,
	NOT_FOUND_HASH: 10,
	PREVIOUS_PASSWORD_WAS_DIFFERENT: 11,
	NOT_FOUND_HASH_ACTIVE: 12,
};
const messages = {
	[CODES.UNKNOWN_ERROR]: {
		status: 500,
		message: `Неизвестная ошибка`,
	},
	[CODES.NOT_FOUND]: {
		status: 404,
		message: `Ничего не найдено`,
	},
	[CODES.NOT_CORRECT_QUERY]: {
		status: 400,
		message: `Некорректный запрос`,
	},
	[CODES.USER_IS_ALREADY_THERE]: {
		status: 400,
		message: `Такой пользователь уже зарегистрирован`,
	},
	[CODES.BAD_PASSWORD_OR_LOGIN]: {
		status: 400,
		message: `Проверьте корректность логина или пароля`,
	},
	[CODES.PASSWORD_MISMATCH]: {
		status: 400,
		message: `Пароли в форме не совпадают`,
	},
	[CODES.REQUIRED_FIELD]: {
		status: 400,
		message: `Обязательные поля не заполнены`,
	},
	[CODES.NOT_VALID_EMAIL]: {
		status: 400,
		message: `Email не валиден! Пример валидного email: petrov@yandex.ru`,
	},
	[CODES.NOT_VALID_PASSWORD]: {
		status: 400,
		message: `Пароль не валиден! Пример валидного пароля: Qq123456`,
	},
	[CODES.NOT_FOUND_USER]: {
		status: 404,
		message: `Пользователь не найден`,
	},
	[CODES.NOT_FOUND_HASH]: {
		status: 404,
		message: `Код для восстановления пароля не был сгенерирован или по нему уже было осуществленно восстановление`,
	},
	[CODES.NOT_FOUND_HASH_ACTIVE]: {
		status: 404,
		message: `Код для активации аакаунта не был сгенерирован или по нему уже была осуществленна активация`,
	},
	[CODES.PREVIOUS_PASSWORD_WAS_DIFFERENT]: {
		status: 400,
		message: `Прежний пароль отличается от введенного`,
	},
};

class ErrorList extends Error {
	constructor(code = 9000, ...params) {
		super();
		
		this.code = code;
		this.status = messages[code].status;
		this.message = typeof messages[code].message === 'function'
		               ? messages[code].message(...params)
		               : messages[code].message;
		
		return this;
	}
	
	static get CODES() {
		return CODES;
	}
}

module.exports = ErrorList;