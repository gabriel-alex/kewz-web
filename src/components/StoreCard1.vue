<template>
  <v-card>
    <v-card-title>{{ store.name }}</v-card-title>
    <v-card-subtitle >{{ store.address }} - {{store.city}} </v-card-subtitle>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon>
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
