const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addCompanyRole = functions.https.onCall((data, context) => {
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, { company: true });
    }).then(()=> {
        return{
            message: `Success! ${data.email} has been made a company`
        }
    }).catch(err=>{
        return err;
    });
});
