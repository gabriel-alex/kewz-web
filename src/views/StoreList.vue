<template>
  <v-container>
    <BaseAlert v-for="alert in alertsarray" :alertobj="alert" :key="alert.id"></BaseAlert>
    <v-row>
      <v-col
        class="pa-3 d-flex flex-column"
        cols="12"
        lg="3"
        md="4"
        sm="6"
        v-for="store in stores"
        :key="`store-${store.id}`"
      >
        <BaseStoreCard1 :store="store"></BaseStoreCard1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import StoreCard1 from "../components/StoreCard1";

export default {
  computed: {
    stores: function() {
      return this.$store.getters.companies;
    },
    alertsarray: function() {
      return this.$store.getters.alerts;
    }
  },
  methods: {
    getcompanies() {
      this.$store.dispatch("getCompanies");
    }
  },
  beforeMount() {
    this.getcompanies();
  }
};
</script>