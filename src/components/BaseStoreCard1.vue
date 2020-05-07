<template>
  <v-card class="elevation-5 flex d-flex flex-column">
    <v-img class="flex" height="150" v-if="store.image" :src="store.image" />
    <v-img class="flex" height="150" v-if="!store.image" src="@/assets/missing_image.png" />
    <v-card-title class="flex">{{ store.name }}</v-card-title>
    <v-card-subtitle class="flex">{{ store.address }} - {{store.city}}</v-card-subtitle>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text :to="{name : 'storeDetail', params: {id: store.id }}">
        <v-icon>mdi-calendar</v-icon>Réserver
      </v-btn>
      <v-btn v-if="!user.role.company && user.data_db && user.data_db.bookmarks && user.data_db.bookmarks.includes(store.id)" color="orange" text @click="delBookmark">
        <v-icon>mdi-bookmark</v-icon>
      </v-btn>
      <v-btn v-else-if="!user.role.company" text @click="addBookmarks">
        <v-icon>mdi-bookmark</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "StoreCard",
  props: {
    store: {
      type: Object,
      required: true
    }
  },
  methods: {
    addBookmarks() {
      this.$store.dispatch("addBookmark", this.store.id);
    },
    delBookmark(){
      this.$store.dispatch("deleteBookmark", this.store.id)
    }
  },
  computed: {
    user: function() {
      return this.$store.getters.user;
    }
  }
};
</script>
