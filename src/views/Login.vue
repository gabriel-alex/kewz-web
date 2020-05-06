<template>
<v-container>
  <BaseAlert v-for="alert in alertsarray" :alertobj="alert" :key="alert.id"></BaseAlert>
  <v-card width="400" class="mx-auto mt-5">
    <!--<v-alert v-if="error != null" dense outlined type="error" dismissible>{{error.msg}}</v-alert>-->
    
    
    <v-card-title>
      <h1 class="display-1">Authentification</h1>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          prepend-icon="mdi-account-circle"
        />
        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="info" :to="{name: 'signup'}">Créer un compte</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="login">Se connecter</v-btn>
    </v-card-actions>
  </v-card>
</v-container>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      showAlert: false,
      showPassword: false,
      email: "",
      password: "",
      emailRules: [
        value => !!value || "Email is required",
        value => value.indexOf("@") !== 0 || "Email should have a username",
        value => value.includes("@") || "Email should include an @ symbol."
        /*value =>
        value.indexOf(".") - value.indexOf("@") > 1 ||
        "Email should contain a valid domain.",
      value =>
        value.indexOf(".") <= value.lenght - 3 ||
        "Email should contain a valid domain extension."*/
      ]
    };
  },
  computed: {
    error: function() {
      return this.$store.getters.error;
    },
    alertsarray: function() {
      return this.$store.getters.alerts;
    }
  },
  methods: {
    login() {
      this.$store.dispatch("fetchUser", {
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>
