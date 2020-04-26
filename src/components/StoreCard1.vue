<template>
  <v-card>
    <v-img src="../assets/logo-match.gif"></v-img>
    <v-card-title>{{ store.name }}</v-card-title>
    <v-card-subtitle >{{ store.address }} - {{store.city}} </v-card-subtitle>
    <v-card-actions>
      
        <v-spacer></v-spacer>
        <v-btn text><v-icon>mdi-calendar</v-icon>Réserver </v-btn>
        <v-btn text>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'StoreCard',
  props: {
    store: {
      type: Object,
      required: true
    }
  }
}
</script>
