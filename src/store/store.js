import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import firebase from "../services/firebase"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    error: null,
    user: {
      loggedIn: false,
      data: null,
    },
    loggedIn: false,
    tokenId: null,
    userId: null,
    email: null,
  },
  getters: {
    user(state) {
      return state.user;
    },
    error(state) {
      return state.error;
    },
    isLogged(state) {
      return state.user.loggedIn;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER_DATA(state, data) {
      state.user.data = data;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    // get user from firebase auth
    fetchUser({ commit }, authData) {
      firebase
        .auth()
        .signInWithEmailAndPassword(authData.email, authData.password)
        .then((res) => {
          console.log(res);
          commit("SET_USER_DATA", res.user);
          commit("SET_LOGGED_IN", true);
          router.push({ name: "store" });
        })
        .catch(function(error) {
          console.log(error);
          commit("SET_ERROR", { msg: error.message, code: error.code });
        });
    },
    createUser({ commit }, userInfo) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
        .catch(function(error) {
          console.log(error);
          commit("SET_ERROR", { msg: error.message, code: error.code });
        });
      firebase
        .auth()
        .currentUser.updateProfile({
          displayName: "Jane Q. User",
        })
        .then(function() {
          // Update successful.
        })
        .catch(function(error) {
          console.log(error);
          commit("SET_ERROR", { msg: error.message, code: error.code });
        });
    },
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(function() {
          commit("SET_USER_DATA", null);
          commit("SET_LOGGED_IN", false);
          // Sign-out successful.
        })
        .catch(function(error) {
          console.log(error);
          commit("SET_ERROR", { msg: error.message, code: error.code });
        });
    },
    onChangeUserCheck({ commit }) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
        } else {
          // No user is signed in.
          commit("SET_USER_DATA", null);
          commit("SET_LOGGED_IN", false);
        }
      });
    },
  },
});
