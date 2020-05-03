<template>
  <v-container>
    <v-alert v-if="error != null" dense outlined type="error" dismissible>{{error.msg}}</v-alert>
    <h1>Paramètres utilisateurs</h1>
    <v-row><v-col>
    <h2>Information du compte</h2>
    <v-form ref="InfoForm">
      <v-row>
        <v-col>
      <v-text-field prepend-icon="mdi-domain" v-if="user.role.company" label="Nom de l'entreprise" v-model="company.name" />
        </v-col>
      </v-row>
      <v-row>
        
        <v-col sm="2">
      <v-img height="100" contain v-if="company.image" :src= company.image />
        </v-col>
        <v-col sm="10">
      <v-file-input v-if="user.role.company" v-model="company.logo" label="Ajouter le logo de l'entreprise" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
      <v-text-field prepend-icon="mdi-map-marker" v-if="user.role.company" label="Adresse" v-model="company.address" />
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="6">
      <v-text-field prepend-icon="mdi-city" v-if="user.role.company" label="Ville" v-model="company.city" />
      </v-col>
      <v-col sm="6">
      <v-text-field type="number" v-if="user.role.company" label="Code postal" v-model="company.postalcode" />
      </v-col>
      </v-row>
      <v-row>
        <v-col>
      <v-text-field prepend-icon="mdi-account" v-if="!user.role.company" label="Nom d'utilisateur" v-model="user.displayName"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
      <v-text-field prepend-icon="mdi-email" label="Email" type="email" v-model="user.data.email"/>
        </v-col>
      </v-row>
      
    </v-form>
    <v-btn class="mr-4" @click="updateCompany" color="primary">Mettre à jour</v-btn>
    </v-col>
    </v-row>
    <v-spacer></v-spacer>
    <v-row>
      <v-col>
    <h2>Modification du mot de passe</h2>
    <v-form>
      <v-row>
        <v-col>
      <v-text-field
        :type="showPassword ? 'text' : 'password'"
        label="Nouveau mot de passe"
        prepend-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        v-model="password"
      />
        </v-col>
      </v-row>
      <v-row><v-col>
        <v-btn class="mr-4" @click="updateCompany" color="primary">Changer le mot de passe</v-btn></v-col></v-row>
    </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>Supprimer le compte</h2>
        <v-form v-model="formValidity">
          <v-checkbox
            label="Etes-vous certain de vouloir supprimer votre compte ? Cette operation est définitive."
            v-model="agreeToDelete"
            :rules="agreeToDeleteRules"
            required
          ></v-checkbox>
        <v-btn class="mr-4" @click="updateCompany" :disabled="!formValidity" color="error">Supprimer</v-btn>
        </v-form>
    <!-- Afficher une boite de confirmation 
        Supprimer les données 
    SUpprimer le compte-->
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
export default {
  data: () => ({
    password: "",
    showPassword: false,
    formValidity: false,
    agreeToDelete: false,
    agreeToDeleteRules: [
      value => !!value || "Veuiller confirmer que vous vous voulez bien supprimer votre compte.",
    ],
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
     getPorfilInfo(){
       if(this.user.role && this.user.role.company ){
         this.$store.dispatch("getCompany", this.user.data.uid)
       }
       
     },
     updateCompany(){
       this.$store.dispatch("updateCompany", {uid: this.user.data.uid, name: this.company.name, address: this.company.address, city: this.company.city, postalcode: this.company.postalcode, logo: this.company.image_name, email: this.company.email})
     }
   },
   computed:{
   user: function() {
      return this.$store.getters.user;
    },
    company: function(){
      return this.$store.getters.company;
    },
    error: function() {
      return this.$store.getters.error},
   },
   beforeMount(){
    this.getPorfilInfo()
   },
};
</script>