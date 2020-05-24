const state = {
	profile: null,
};

const getters = {
	profile: (state) => state.profile,
};

const mutations = {
	LOGIN: (statem, profile) => {
		state.profile = profile;
	},
	LOGOUT: (state) => {
		state.profile = null;
	},
};

export default {
	state,
	getters,
	mutations,
};