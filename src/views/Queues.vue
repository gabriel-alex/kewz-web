<template>
    <v-container>
        <BaseAlert v-for="alert in alertsarray" :alertobj="alert" :key="alert.id"></BaseAlert>
        <h1>Files d'attente</h1>
        <v-col
        class="d-flex flex-column"
        v-for="booking in bookings"
        :key="`booking-${booking.id}`"
      >
        <BaseUserBookingCard :booking="booking"></BaseUserBookingCard>
      </v-col>
    </v-container>
</template>

<script>
export default {
  computed: {
    bookings: function() {
      return this.$store.getters.bookings;
    },
    alertsarray: function() {
      return this.$store.getters.alerts;
    }
  },
  methods: {
    getuserbookings() {
      this.$store.dispatch("getUserBookings");
    }
  },
  beforeMount() {
    this.getuserbookings();
  }
};
</script>