<template>
  <v-card width="400" class="mx-auto mt-5">
    <v-alert v-if="error != null" dense outlined type="error" dismissible>{{error.msg}}</v-alert>
    <v-card-title>
      <h1 class="display-1">Authentification</h1>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field v-model="email" label="E-mail" prepend-icon="mdi-account-circle" />
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
      <v-btn color="success" :to="{name: 'signup'}">Créer un compte</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="info" @click="login" >Se connecter</v-btn>
    </v-card-actions>
  </v-card>
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
    };
  },
  computed: {
	error: function() {
		return this.$store.getters.error},
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
