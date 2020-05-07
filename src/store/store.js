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
      bookings: []
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
    alerts(state) {
      return state.alerts;
    },
    bookings(state){
      return state.user.bookings;
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
    SET_USER_DATA_FROM_DB(state, value) {
      state.user.data_db = value;
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
    ADD_ALERT(state, value) {
      var min = Math.ceil(100);
      var max = Math.floor(999);
      var randomid = Math.floor(Math.random() * (max - min)) + min;
      var alert = {
        id: randomid,
        msg: value.msg,
        type: value.type,
        duration: value.duration,
      };
      state.alerts.push(alert);
    },
    DEL_ALERT(state, value) {
      state.alerts.splice((obj) => obj.id == value);
    },
    ADD_BOOKING(state, value){
      state.user.bookings.push(value)
    },
    FLUSH_BOOKINGS(state) {
      state.user.bookings = [];
    },
    ADD_BOOKMARK(state, value){
      if(!state.user.data_db){
        state.user.data_db = {
          bookmarks: []
        }
      }
      state.user.data_db.bookmarks.push(value)
    },
    DEL_BOOKMARK(state, value){
      state.user.data_db.bookmarks.splice((obj) => obj.id == value);
    }
  },
  actions: {
    // get user from firebase auth
    fetchUser({ commit }, authData) {
      firebase
        .auth()
        .signInWithEmailAndPassword(authData.email, authData.password)
        .then((res) => {
          var isCompany = false;
          firebase
            .auth()
            .currentUser.getIdTokenResult()
            .then((idTokenRes) => {
              if (idTokenRes.claims.company == true) {
                isCompany = true;
                commit("SET_USER_ROLE", { role: "company", value: true });
              } else {
                commit("SET_USER_ROLE", { role: "company", value: false });
              }
            });
          console.log(res);
          commit("SET_USER_DATA", res.user);
          commit("SET_LOGGED_IN", true);
          router.push({ name: "store" });

          if (isCompany) {
            // fetch company info
          } else {
            firebase
              .firestore()
              .collection("clients")
              .doc(res.user.uid)
              .get()
              .then((doc) => {
                if (!doc.exists) {
                  commit("ADD_ALERT", {
                    msg:
                      "Error while retreiving information about the user. Information is not available in the database",
                    type: "error",
                    duration: 4000,
                  });
                  console.log('User does not exist in Firestore')
                } else {
                  commit("SET_USER_DATA_FROM_DB", doc.data());
                }
              })
              .catch((err) => {
                commit("ADD_ALERT", {
                  msg: "Error while retreiving information about the user.",
                  type: "error",
                  duration: 4000,
                });
                console.log(
                  "Error while retreiving information about the user.",
                  err
                );
              });
          }
        })
        .catch(function(error) {
          console.log(error);
          commit("ADD_ALERT", {
            msg: "error.message",
            type: "error",
            duration: 4000,
          });
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
              commit("ADD_ALERT", {
                msg: "Error while saving account information.",
                type: "error",
                duration: 4000,
              });
              console.log(error);
            });
          // update role on auth service
          addCompanyRole({ email: userInfo.email , isCompany: userInfo.company})
            .then(() => {
              commit("SET_USER_ROLE", {
                role: "company",
                value: userInfo.company,
              });
            })
            .catch(function(error) {
              commit("ADD_ALERT", {
                msg: "Error while updating role associated to the account.",
                type: "error",
                duration: 4000,
              });
              console.log(error);
            });
          if (userInfo.company === true) {
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
                    commit("ADD_ALERT", {
                      msg: "Error while uploading the logo image.",
                      type: "error",
                      duration: 4000,
                    });
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
                commit("ADD_ALERT", {
                  msg: "Error while saving company information in database.",
                  type: "error",
                  duration: 4000,
                });
                console.log("Error setting Company info in firestore", err);
              });
            commit("SET_USER_DATA", result.user);
            commit("SET_LOGGED_IN", true);
            router.push({ name: "store" });
          } else {
            var client_data = {
              name: userInfo.name,
            };
            firebase
              .firestore()
              .collection("clients")
              .doc(result.user.uid)
              .set(client_data)
              .catch((err) => {
                commit("ADD_ALERT", {
                  msg: "Error while saving user information in database.",
                  type: "error",
                  duration: 4000,
                });
                console.log("Error setting client info in firestore", err);
              });
            commit("SET_USER_DATA", result.user);
            commit("SET_LOGGED_IN", true);
            router.push({ name: "store" });
          }
        })
        .catch(function(error) {
          commit("ADD_ALERT", {
            msg:
              "Error while creating the account in the authentication system.",
            type: "error",
            duration: 4000,
          });
          console.log(error);
        });
    },
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(function() {
          commit("RESET_USER_DATA");
          commit("SET_LOGGED_IN", false);
          commit("ADD_ALERT", {
            msg: "You have been properly sign out.",
            type: "info",
            duration: 4000,
          });
          // Sign-out successful.
        })
        .catch(function(error) {
          commit("ADD_ALERT", {
            msg: "Error while signout.",
            type: "error",
            duration: 4000,
          });
          console.log(error);
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
            commit("ADD_ALERT", {
              msg: "Compny does not exist in database.",
              type: "error",
              duration: 4000,
            });
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
                  /*commit("ADD_ALERT", {
                    msg: "Error while retrieving image of the company.",
                    type: "error",
                    duration: 4000,
                  });*/
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
                  commit("ADD_ALERT", {
                    msg: "Error while deleting the previous logo.",
                    type: "error",
                    duration: 4000,
                  });
                });
            })
            .catch((err) => {
              console.log("Error while uploading the image", err);
              commit("ADD_ALERT", {
                msg: "Error while uploading the new logo.",
                type: "error",
                duration: 4000,
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
          commit("ADD_ALERT", {
            msg: "Error while updating information about company.",
            type: "error",
            duration: 4000,
          });
          console.log("Error while updating information about company", err);
        });

      var user = firebase.auth().currentUser;
      if (companyData.name != usr.data.displayName) {
        user
          .updateProfile({
            displayName: companyData.name,
          })
          .catch((err) => {
            commit("ADD_ALERT", {
              msg: "Error while updating user name.",
              type: "error",
              duration: 4000,
            });
            console.log("Error while updating name", err);
          });
      }

      if (companyData.email != usr.data.email) {
        user.updateEmail(companyData.email).catch((err) => {
          commit("ADD_ALERT", {
            msg: "Error while updating email.",
            type: "error",
            duration: 4000,
          });
          console.log("Error while updating email", err);
        });
      }
    },
    deleteAlert({ commit }, id) {
      commit("DEL_ALERT", id);
    },
    deleteAccount({commit}) {
      var user = firebase.auth().currentUser;
      firebase
        .firestore()
        .collection("companies")
        .doc(user.data().uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (doc.data().image_name) {
              storageRef
                .child(`companies/${doc.data().image_name}`)
                .delete()
                .catch((err) => {
                  commit("ADD_ALERT", {
                    msg: "Error while getting information about the company before deleting it.",
                    type: "error",
                    duration: 4000,
                  });
                  console.log(
                    "Error while deleting image assoicated to the account",
                    err
                  );
                });
            }
          }
        });
      firebase
        .firestore()
        .collection("companies")
        .doc(user.data().uid)
        .delete()
        .catch((err) => {
          console.log(
            "Error while deleting information concerning the account",
            err
          );
          commit("ADD_ALERT", {
            msg: "Error while deleting company information from the database.",
            type: "error",
            duration: 4000,
          });
        });
      user
        .delete()
        .then(function() {
          // User deleted.
        })
        .catch(function(error) {
          console.log("Error while deleting account", error);
          commit("ADD_ALERT", {
            msg: "Error while deleting user account.",
            type: "error",
            duration: 4000,
          });
          // An error happened.
        });
    },
    addBookmark({ commit }, company_id) {
      var user = firebase.auth().currentUser;
      var clientRef = firebase
        .firestore()
        .collection("clients")
        .doc(user.uid);
      clientRef
        .update({
          bookmarks: firebase.firestore.FieldValue.arrayUnion(company_id),
        }).then(
          commit("ADD_BOOKMARK", company_id)
        )
        .catch((err) => {
          commit("ADD_ALERT", {
            msg: "Error while adding a bookmark.",
            type: "error",
            duration: 4000,
          });
          console.log("Error while adding a bookmark.", err);
        });
    },
    deleteBookmark({commit}, company_id){
      var user = firebase.auth().currentUser;
      var clientRef = firebase
        .firestore()
        .collection("clients")
        .doc(user.uid);
      clientRef
        .update({
          bookmarks: firebase.firestore.FieldValue.arrayRemove(company_id),
        }).then(
          commit("DEL_BOOKMARK", company_id)
        )
        .catch((err) => {
          commit("ADD_ALERT", {
            msg: "Error while deleting a bookmark.",
            type: "error",
            duration: 4000,
          });
          console.log("Error while deleting a bookmark.", err);
        });
    },
    addBooking({ commit }, booking_info) {
      var user = firebase.auth().currentUser;
      console.log("bookedtime", booking_info.time)
      var user_booking = {
        company_id: booking_info.company,
        schedule: firebase.firestore.Timestamp.fromMillis(booking_info.time),
      };
      var company_booking = {
        user_id: user.uid,
        schedule: firebase.firestore.Timestamp.fromMillis(booking_info.time),
      };
      firebase
        .firestore()
        .collection("clients")
        .doc(user.uid)
        .collection("bookings")
        .add(user_booking).then(ref=>{
          firebase.firestore().collection("companies").doc(booking_info.company).collection("bookings").doc(ref.id).set(company_booking).then(
            router.push({ name: "queues" })
            ).catch((err) => {
              commit("ADD_ALERT", {
                msg: "Error while adding a reservation to company information.",
                type: "error",
                duration: 4000,
              });
              console.log("Error while adding a reservation to company db.", err);
            });
        })
        .catch((err) => {
          commit("ADD_ALERT", {
            msg: "Error while adding a reservation to user information.",
            type: "error",
            duration: 4000,
          });
          console.log("Error while adding a reservation to user db.", err);
        });
      
    },
    getUserBookings({commit}){
      var userIsCompany = false
      var user = firebase.auth().currentUser;
      user.getIdTokenResult()
            .then((idTokenRes) => {
              if (idTokenRes.claims.company == true) {
                userIsCompany = true;
              }
            });
            if(userIsCompany){
              firebase.firestore().collection("companies").doc(user.uid).collection("bookings").get().then((snapshot) => {
                commit("FLUSH_BOOKINGS")
                snapshot.forEach((doc) => {
                  var company_booking = {
                    company_id : user.uid,
                    booking_id : doc.id,
                    client_id : doc.data().client_id,
                    schedule : doc.data().schedule,
                  }
                  commit("ADD_BOOKING", company_booking)
                })
              }).catch((err)=>{
                commit("ADD_ALERT", {
                  msg: "Error while retrieving bookings from the company.",
                  type: "error",
                  duration: 4000,
                });
                console.log("Error while retrieving bookings from the company.", err);
              })
            }else{
              firebase.firestore().collection("clients").doc(user.uid).collection("bookings").where('schedule','>',firebase.firestore.Timestamp.now()).orderBy('schedule').get().then((snapshot) => {
                commit("FLUSH_BOOKINGS")
                var companiesRef = firebase.firestore().collection("companies")
                snapshot.forEach((client_doc) => {
                  companiesRef.doc(client_doc.data().company_id).get().then((company_doc)=>{
                    var user_booking = {
                      client_id: user.uid,
                      booking_id: client_doc.id,
                      company_id : client_doc.data().company_id,
                      schedule : new Date(client_doc.data().schedule.seconds*1000),
                      company_name : company_doc.data().name,
                      company_address: company_doc.data().address,
                      company_city: company_doc.data().city,
                      company_postalcode: company_doc.data().postalcode,
                    }
                    commit("ADD_BOOKING", user_booking)
                  }).catch((err)=>{
                    commit("ADD_ALERT", {
                      msg: "Error while retrieving company info from user booking.",
                      type: "error",
                      duration: 4000,
                    });
                    console.log("Error while retrieving company info from user bookings.", err);
                  })
                  
                })
              }).catch((err)=>{
                commit("ADD_ALERT", {
                  msg: "Error while retrieving bookings from the client.",
                  type: "error",
                  duration: 4000,
                });
                console.log("Error while retrieving bookings from the client.", err);
              })
            }
    },
    deleteBooking({commit}, booking){
      firebase.firestore().collection("companies").doc(booking.company_id).collection("bookings").doc(booking.booking_id).delete().catch(function(err) {
        console.log("Error while deleting booking from companies information", err);
        commit("ADD_ALERT", {
          msg: "Error while deleting booking from companies information.",
          type: "error",
          duration: 4000,
        });
      });
      firebase.firestore().collection("clients").doc(booking.client_id).collection("bookings").doc(booking.booking_id).delete().catch(function(err) {
        console.log("Error while deleting booking from users information", err);
        commit("ADD_ALERT", {
          msg: "Error while deleting booking from users information.",
          type: "error",
          duration: 4000,
        });
      });
      router.go()
    }
  },
});
