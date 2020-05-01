import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import firebase from "../services/firebase";

Vue.use(Vuex);
var addCompanyRole = firebase.functions().httpsCallable("addCompanyRole");

export default new Vuex.Store({
  state: {
    companies: [],
    error: null,
    user: {
      loggedIn: false,
      data: null,
      role: {}
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
    companies(state) {
      return state.companies;
    },
    company(state) {
      return state.companies[0];
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER_DATA(state, data) {
      state.user.data = data;
    },
    SET_USER_ROLE(state, data) {
      state.user.role.company = data.value
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    ADD_COMPANIES(state, value) {
      var storedata = value.store;
      storedata.id = value.id;
      state.companies.push(storedata);
    },
    FLUSH_COMPANIES(state) {
      state.companies = [];
    },
    FLUSH_ERROR(state) {
      state.error = null;
    },
    ADD_COMPANY(state, value) {
      var storedata = value.store;
      storedata.id = value.id;
      state.companies = [];
      state.companies.push(storedata);
    },
  },
  actions: {
    // get user from firebase auth
    fetchUser({ commit }, authData) {
      firebase
        .auth()
        .signInWithEmailAndPassword(authData.email, authData.password)
        .then((res) => {
          firebase.auth().currentUser.getIdTokenResult().then((idTokenRes)=>{
            if(idTokenRes.claims.company){
              commit("SET_USER_ROLE", {role: 'company', value: true});
            }else{
              commit("SET_USER_ROLE", {role: 'company', value: false});
            }
          })
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
        .then((result) => {
          result.user
            .updateProfile({
              displayName: userInfo.name,
            })
            .catch(function(error) {
              console.log(error);
              commit("SET_ERROR", { msg: error.message, code: error.code });
            });
          addCompanyRole({ email: userInfo.email }).then(()=> {
            commit("SET_USER_ROLE", {role: 'company', value: true});
          }).catch(function(error) {
            console.log(error);
            commit("SET_ERROR", { msg: error.message, code: error.code });
          });
          commit("SET_USER_DATA", result.user);
          commit("SET_LOGGED_IN", true);
          router.push({ name: "store" });
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
    onChangeErrorFlush({commit}){
      commit("FLUSH_ERROR")
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
    getCompanies({ commit }) {
      firebase
        .firestore()
        .collection("companies")
        .get()
        .then((snapshot) => {
          commit("FLUSH_COMPANIES");
          snapshot.forEach((doc) => {
            commit("ADD_COMPANIES", { id: doc.id, store: doc.data() });

            console.log(doc.id, "=>", doc.data());
          });
        })
        .catch((err) => {
          console.log("Error getting documents", err);
        });
    },
    getCompany({ commit }, docID) {
      firebase
        .firestore()
        .collection("companies")
        .doc(docID)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            commit("SET_ERROR", { msg: "No such document!", code: "404" });
            console.log("No such document!");
          } else {
            commit("ADD_COMPANY", { id: docID, store: doc.data() });
            console.log("Document data:", doc.data());
          }
        })
        .catch((err) => {
          console.log("Error getting documents", err);
        });
    },
  },
});
