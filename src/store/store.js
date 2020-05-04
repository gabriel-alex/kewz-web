import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import firebase from "../services/firebase";

Vue.use(Vuex);
var storageRef = firebase.storage().ref();

//cloud functions
var addCompanyRole = firebase.functions().httpsCallable("addCompanyRole");

export default new Vuex.Store({
  state: {
    companies: [],
    alerts: [],
    error: null,
    user: {
      loggedIn: false,
      data: null,
      role: {},
    },
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
    alerts(state){
      return state.alerts
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    RESET_USER_DATA(state) {
      state.user.data = null;
    },
    SET_USER_DATA(state, data) {
      state.user.data = {};
      state.user.data.email = data.email;
      state.user.data.displayName = data.displayName;
      state.user.data.emailVerified = data.emailVerified;
      state.user.data.isAnonymous = data.isAnonymous;
      state.user.data.uid = data.uid;
      state.user.data.phoneNumber = data.phoneNumber;
      state.user.data.photoURL = data.photoURL;
      state.user.data.refreshToken = data.refreshToken;
    },
    SET_USER_ROLE(state, data) {
      state.user.role.company = data.value;
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
      storedata.image = value.image;
      state.companies.push(storedata);
    },
    ADD_ALERT(state, value){
      var min = Math.ceil(100);
      var max = Math.floor(999);
      var randomid = Math.floor(Math.random() * (max - min)) + min
      var alert = {id: randomid, msg: value.msg, type: value.type, duration: value.duration }
      state.alerts.push(alert)
    },
    DEL_ALERT(state,value){
      state.alerts.splice(obj=>obj.id == value)
    }
  },
  actions: {
    // get user from firebase auth
    fetchUser({ commit }, authData) {
      firebase
        .auth()
        .signInWithEmailAndPassword(authData.email, authData.password)
        .then((res) => {
          firebase
            .auth()
            .currentUser.getIdTokenResult()
            .then((idTokenRes) => {
              if (idTokenRes.claims.company) {
                commit("SET_USER_ROLE", { role: "company", value: true });
              } else {
                commit("SET_USER_ROLE", { role: "company", value: false });
              }
            });
          console.log(res);
          commit("SET_USER_DATA", res.user);
          commit("SET_LOGGED_IN", true);
          router.push({ name: "store" });
        })
        .catch(function(error) {
          console.log(error);
          commit("SET_ERROR", { msg: error.message, code: error.code });
          commit("ADD_ALERT", { msg: error.message, type: "error", duration: 4000 });
        });
    },
    createUser({ commit }, userInfo) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
        .then((result) => {
          // update name on auth service
          result.user
            .updateProfile({
              displayName: userInfo.name,
            })
            .catch(function(error) {
              console.log(error);
              commit("SET_ERROR", { msg: error.message, code: error.code });
            });
          // update role on auth service
          addCompanyRole({ email: userInfo.email })
            .then(() => {
              commit("SET_USER_ROLE", { role: "company", value: true });
            })
            .catch(function(error) {
              console.log(error);
              commit("SET_ERROR", { msg: error.message, code: error.code });
            });
          // load image
          if (userInfo.logo) {
            var image_name = userInfo.logo.name;
            const fr = new FileReader();
            fr.readAsDataURL(userInfo.logo);
            fr.addEventListener("load", () => {
              //var imageUrl = fr.result
              var imageFile = userInfo.logo; // this is an image file that can be sent to server...
              storageRef
                .child(`companies/${image_name}`)
                .put(imageFile)
                .then(function() {})
                .catch((err) => {
                  console.log("Error while uploading the image", err);
                });
            });
          } else {
            image_name = "";
          }
          // add data on firebase
          var company_data = {
            address: userInfo.address,
            city: userInfo.city,
            postalcode: userInfo.postalcode,
            name: userInfo.name,
            image_name: image_name,
          };

          firebase
            .firestore()
            .collection("companies")
            .doc(result.user.uid)
            .set(company_data)
            .catch((err) => {
              console.log("Error setting Company info in firestore", err);
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
          commit("RESET_USER_DATA");
          commit("SET_LOGGED_IN", false);
          // Sign-out successful.
        })
        .catch(function(error) {
          console.log(error);
          commit("SET_ERROR", { msg: error.message, code: error.code });
        });
    },
    onChangeErrorFlush({ commit }) {
      commit("FLUSH_ERROR");
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
            if (doc.data().image_name) {
              var imageRef = storageRef
                .child("companies")
                .child(doc.data().image_name);
              imageRef
                .getDownloadURL()
                .then(function(url) {
                  commit("ADD_COMPANY", {
                    id: doc.id,
                    store: doc.data(),
                    image: url,
                  });
                })
                .catch(function(error) {
                  console.log("error while retrieving image ", error);
                  //commit("SET_ERROR", { msg: error.message, code: error.code });
                  commit("ADD_COMPANY", {
                    id: doc.id,
                    store: doc.data(),
                    image: null,
                  });
                });
            } else {
              commit("ADD_COMPANY", {
                id: doc.id,
                store: doc.data(),
                image: null,
              });
            }
          });
        })
        .catch((err) => {
          console.log("Error getting documents", err);
        });
    },
    getCompany({ commit }, docID) {
      commit("FLUSH_COMPANIES");
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
            if (doc.data().image_name) {
              var imageRef = storageRef
                .child("companies")
                .child(doc.data().image_name);
              imageRef
                .getDownloadURL()
                .then(function(url) {
                  commit("ADD_COMPANY", {
                    id: doc.id,
                    store: doc.data(),
                    image: url,
                  });
                })
                .catch(function(error) {
                  console.log("Error while retrieving image", error);
                  //commit("SET_ERROR", { msg: error.message, code: error.code });
                  commit("ADD_COMPANY", {
                    id: doc.id,
                    store: doc.data(),
                    image: null,
                  });
                });
            }
            //commit("ADD_COMPANY", { id: docID, store: doc.data() });
            //console.log("Document data:", doc.data());
          }
        })
        .catch((err) => {
          console.log("Error getting documents", err);
        });
    },
    updateCompany({ commit }, companyData) {
      var company_data = {
        address: companyData.address,
        name: companyData.name,
        city: companyData.city,
        postalcode: companyData.postalcode,
      };
      // load image
      console.log(`companyData value ${company_data}`);
      console.log("companyData value " + companyData.email);
      if (companyData.logo) {
        var image_name = companyData.logo.name;
        const fr = new FileReader();
        fr.readAsDataURL(companyData.logo);
        fr.addEventListener("load", () => {
          //var imageUrl = fr.result
          var imageFile = companyData.logo; // this is an image file that can be sent to server...
          var extension = image_name.slice(
            ((image_name.lastIndexOf(".") - 1) >>> 0) + 2
          );
          var new_name = `${companyData.uid}.${extension}`;
          storageRef
            .child(`companies/${new_name}`)
            .put(imageFile)
            .then(function() {
              company_data.image_name = new_name;
              storageRef
                .child(`companies/${companyData.prev_image}`)
                .delete()
                .catch(function(err) {
                  console.log("Error While deleting the previous logo", err);
                  commit("SET_ERROR", {
                    msg: "Error while deleting the previous logo",
                    code: "Firbase error",
                  });
                });
            })
            .catch((err) => {
              console.log("Error while uploading the image", err);
              commit("SET_ERROR", {
                msg: "Error while uploading the new logo",
                code: "Firbase error",
              });
            });
        });
      }
      var usr = this.state.user;

      firebase
        .firestore()
        .collection("companies")
        .doc(companyData.uid)
        .update(company_data)
        .catch((err) => {
          console.log("Error while updating information about company", err);
        });

      var user = firebase.auth().currentUser;
      if (companyData.name != usr.data.displayName) {
        user
          .updateProfile({
            displayName: companyData.name,
          })
          .catch((err) => {
            console.log("Error while updating name", err);
          });
      }

      if (companyData.email != usr.data.email) {
        user.updateEmail(companyData.email).catch((err) => {
          console.log("Error while updating email", err);
        });
      }
    },
    deleteAlert({commit}, id){
      commit("DEL_ALERT", id)
    },
    deleteAccount() {
      var user = firebase.auth().currentUser;
      firebase
        .firestore()
        .collection("companies")
        .doc(user.data().uid)
        .get().then((doc)=>{
          if(doc.exists){
            if (doc.data().image_name) {
              storageRef.child(`companies/${doc.data().image_name}`).delete().catch((err)=>{
                console.log("Error while deleting image assoicated to the account", err)
              })
            }
          }
        })
      firebase
        .firestore()
        .collection("companies").doc(user.data().uid).delete().catch((err)=>{
          console.log("Error while deleting information concerning the account",err)
        });
      user
        .delete()
        .then(function() {
          // User deleted.
        })
        .catch(function(error) {
          console.log("Error while deleting account", error);
          // An error happened.
        });
    },
  },
});
