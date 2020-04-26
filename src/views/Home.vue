<template>

<div>
    <v-container fluid class="first-image">
    <v-row align="center" style="min-height: 300px;">
        <v-col>
            <v-row justify="center"><h1 class="white--text text-center">Le meilleur moyen de respecter le distanciation sociale lorsque vous faites vos achats...</h1></v-row>
            <v-row style="height: 60px"></v-row>
            <v-row justify="center"><h1 class="white--text text-center">... c'est de ne pas faire la file</h1></v-row>
            </v-col>
    </v-row>
    </v-container>
    <v-container fluid >
        <v-row align="center" >
            <v-col>
                <v-row justify="center">
                    <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="100"
        />
                </v-row>
                <v-row justify="center">
                    <h1 class="text-center">Application de files d'attentes virtuelles</h1>
                </v-row>
                <v-row justify="center">
                    <h2 class="text-center">Limitez les risques. Optimisez votre temps.</h2>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
    <v-row >
    <v-container fluid primary lighten-1>
        <h1 class="text-center white--text">Pourquoi utiliser Kewz? </h1>
        <v-row>
            <v-col cols="12" md="4" justify="center" >
                <v-img></v-img>
                <h3 class="text-center">Distanciation sociale</h3>
            </v-col>
            <v-col cols="12" md="4" justify="center" >
                <h3 class="text-center">Gestion de l'attente</h3>
            </v-col>
            <v-col cols="12" md="4" justify="center" >
                <h3 class="text-center">Simple</h3>
            </v-col>
            <v-col cols="12" md="4" justify="center" >
                <h3 class="text-center">Gratuit</h3>
            </v-col>
            <v-col cols="12" md="4" justify="center" >
                <h3 class="text-center">Open source</h3>
            </v-col>
        </v-row>
        

    </v-container>
    </v-row>
</div>
</template>

<style scoped>
.first-image{
    background-image: url("../assets/hal-gatewood-Nzb4LBsctyQ-unsplash.jpg");
    background-size: cover;
    background-position: center;
}

</style>