<template>
  <v-container>
    <BaseAlert v-for="alert in alertsarray" :alertobj="alert" :key="alert.id"></BaseAlert>
    <v-row>
      <v-col>
        <h1>Création d'un compte</h1>
        <v-form ref="signUpForm" v-model="formValidity">
          <v-switch
            label="Compte pour entreprise ou une institutions (Créer et gérer des files d'attentes)"
            v-model="isCompany"
          ></v-switch>
          <v-text-field
            prepend-icon="mdi-domain"
            v-if="isCompany"
            label="Nom de l'entreprise"
            v-model="companyName"
            :rules="companynameRules"
          ></v-text-field>
          <v-file-input v-if="isCompany" v-model="logo" accept="image/*" label="Ajouter le logo de l'entreprise"></v-file-input>
          <v-text-field
            prepend-icon="mdi-account"
            v-if="!isCompany"
            label="Nom d'utilisateur"
            v-model="userName"
            :rules="nameRules"
          ></v-text-field>
          <v-text-field
            prepend-icon="mdi-email"
            label="Email"
            type="email"
            v-model="email"
            :rules="emailRules"
          ></v-text-field>
          <v-text-field
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            v-model="password"
          />

          <v-checkbox
            label="Acceptions les termes et conditions d'utilisation de la platforme"
            v-model="agreeToTerms"
            :rules="agreeToTermsRules"
            required
          ></v-checkbox>

          <v-btn class="mr-4" @click="signUp" color="primary" :disabled="!formValidity">Créer</v-btn>
          <!--
                <v-btn class="mr-4" color="success" @click="validateForm">Validate Form</v-btn>
                <v-btn class="mr-4" color="warning" @click="resetValidation">Reset Validation</v-btn>
          <v-btn class="mr-4" color="error" @click="resetForm">Reset</v-btn>-->
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    password: "",
    showPassword: false,
    isCompany: false,
    companyName: "",
    companynameRules: [
      value => !!value || "Vous devez donner votre nom d'entreprise. Il pourra etre modifié ultérieurement. ",
    ],
    userName: "",
    logo: "",
    nameRules: [
      value => !!value || "Vous devez definir un nom. Il pourra etre modifié ultérieurement. ",
    ],
    agreeToTerms: false,
    agreeToTermsRules: [
      value => !!value || "You must agree to the terms and conditions to signup for an account.",
    ],
    email: "",
    emailRules: [
      value => !!value || "Email is required",
      value => value.indexOf("@") !== 0 || "Email should have a username",
      value => value.includes("@") || "Email should include an @ symbol.",
      /*value =>
        value.indexOf(".") - value.indexOf("@") > 1 ||
        "Email should contain a valid domain.",
      value =>
        value.indexOf(".") <= value.lenght - 3 ||
        "Email should contain a valid domain extension."*/
    ],
    formValidity: false
  }),
  computed: {
    alertsarray: function() {
      return this.$store.getters.alerts;
    }
  },
  methods: {
    signUp() {
      if (this.isCompany) {
        this.$store.dispatch("createUser", {
          email: this.email,
          password: this.password,
          name: this.companyName,
          company: true,
          address: "",
          city:"",
          postalcode:"", 
          logo: this.logo,
        });
      } else {
        this.$store.dispatch("createUser", {
          email: this.email,
          password: this.password,
          name: this.userName,
          company: false
        });
      }
    },
    resetForm() {
      this.$refs.signUpForm.reset();
    },
    resetValidation() {
      this.$refs.signUpForm.resetValidation();
    },
    validateForm() {
      this.$refs.signUpForm.validate();
    }
  }
};
</script>