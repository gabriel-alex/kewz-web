<template>
  <div>
    <v-parallax dark src="@/assets/hal-gatewood-Nzb4LBsctyQ-unsplash.jpg">
      <v-row no-gutters align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1
            class="white--text"
          >Le meilleur moyen de respecter le distanciation sociale lorsque vous faites vos achats...</h1>
        </v-col>
      </v-row>
      <v-row no-gutters align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="white--text text-center">... c'est de ne pas faire la file</h1>
        </v-col>
      </v-row>
    </v-parallax>
   
    <v-container fluid>
      <v-row align="center">
        <v-col>
          <v-row justify="center">
            <v-img
              alt="Vuetify Logo"
              class="shrink mt-2"
              contain
              src="@/assets/KEWZ-logo-green.png"
              width="200"
            ></v-img>
          </v-row>
          <!--<v-row justify="center">
            <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              src="@/assets/KEWZ-green.png"
              transition="scale-transition"
              width="200"
            ></v-img>
          </v-row>-->
          <v-row justify="center">
            <h1 class="text-center">Application de files d'attentes virtuelles</h1>
          </v-row>
          <v-row justify="center">
            <h2 class="text-center">Limitez les risques. Optimisez votre temps.</h2>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-row>
      <v-container fluid primary lighten-1>
        <h1 class="text-center white--text">Pourquoi utiliser Kewz?</h1>
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="2" align="center">
            <v-img alt="gestion de l'attente logo" contain src="@/assets/distanciation-logo.svg" width="100"></v-img>
            <h3 class="text-center white--text">Respecter la distanciation physique</h3>
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2" align="center">
            <v-img alt="gestion de l'attente logo" contain src="@/assets/attente-logo.svg" width="100"></v-img>
            <h3 class="text-center white--text">Faciliter la gestion de l'attente</h3>
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2" align="center">
            <v-img alt="simple logo" contain src="@/assets/simple-logo.svg" width="100"></v-img>
            <h3 class="text-center white--text">Simplifier l'utilisation</h3>
          </v-col>
          <v-col cols="12" md="4" lg="2" align="center">
            <v-img alt="Open source logo" contain src="@/assets/multi-logo.svg" width="100"></v-img>
            <h3 class="text-center white--text">Multisupport</h3>
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2" align="center">
            <v-img alt="free logo" contain src="@/assets/free-logo.svg" width="100"></v-img>
            <h3 class="text-center white--text">Gratuit</h3>
          </v-col>
          <v-col cols="12" md="4" lg="2" align="center">
            <v-img alt="Open source logo" contain src="@/assets/opensource-logo.svg" width="100"></v-img>
            <h3 class="text-center white--text">Open source</h3>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </div>
</template>
