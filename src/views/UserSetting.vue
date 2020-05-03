<template>
  <v-container>
    <h1>Paramètres utilisateurs</h1>
    <h2>Information du compte</h2>
    <v-form ref="InfoForm">
      <v-text-field
        prepend-icon="mdi-domain"
        v-if="user.role.company"
        label="Nom de l'entreprise"
        v-model="companyName"
      />
      <v-file-input v-if="user.role.company" label="Ajouter le logo de l'entreprise"/>
      <v-text-field prepend-icon="mdi-map-marker" v-if="user.role.company" label="Adresse" v-model="address" />
      <v-text-field sm="6" prepend-icon="mdi-city" v-if="user.role.company" label="Ville" v-model="city" />
      <v-text-field sm="6"
      type="number"
        v-if="user.role.company"
        label="Code postal"
        v-model="postal_code"
      />
      <v-text-field
        prepend-icon="mdi-account"
        v-if="!user.role.company"
        label="Nom d'utilisateur"
        v-model="userName"/>
      <v-text-field prepend-icon="mdi-email" label="Email" type="email" v-model="email"></v-text-field>
    </v-form>
    <v-spacer></v-spacer>
    <h2>Modification du mot de passe</h2>
    <v-form>
      <v-text-field
        :type="showPassword ? 'text' : 'password'"
        label="Nouveau mot de passe"
        prepend-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        v-model="password"
      />
    </v-form>
    <h2>Supprimer le compte</h2>
    <!-- Afficher une boite de confirmation 
        Supprimer les données 
    SUpprimer le compte-->
  </v-container>
</template>

<script>
export default {
  data: () => ({
    password: "",
    showPassword: false,
    isCompany: true,
    companyName: "",
    userName: "",
    email: "",
    address: "",
    city: "",
    postal_code: "",
    schedules: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" }
    }
  }),
   methods: {
   },
   computed:{
   user: function() {
      return this.$store.getters.user;
    }
   }
};
</script>