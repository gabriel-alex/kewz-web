<template>
  <v-card class="elevation-5 flex d-flex flex-column">
    <v-img class="flex" height="150" v-if="store.image" :src= store.image />
    <v-img class="flex" height="150" v-if="!store.image" src= "@/assets/missing_image.png" />
    <v-card-title class="flex">{{ store.name }}</v-card-title>
    <v-card-subtitle class="flex" >{{ store.address }} - {{store.city}} </v-card-subtitle>
    <v-card-actions>
      
        <v-spacer></v-spacer>
        <v-btn text :to="{name : 'storeDetail', params: {id: store.id }}" ><v-icon>mdi-calendar</v-icon>Réserver</v-btn>
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
