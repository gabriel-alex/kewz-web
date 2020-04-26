<template>
  <v-container>
    <h1>
      OOPS! It seems the page your are trying to access does not exists. Come back to
      <router-link :to="{ name: 'home' }">main page</router-link>.
    </h1>
  </v-container>
</template>
