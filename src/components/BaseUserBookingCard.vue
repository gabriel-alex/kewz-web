<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="12" sm="2" class="flex" align="center">
          <!--<v-row dense>{{ booking.schedule }}</v-row>-->
          <v-row class="pa-0 mb-0"
            no-gutters
            justify="center"
          >{{ booking.schedule.getDay() }}/{{ booking.schedule.getMonth() }}/{{ booking.schedule.getYear() }} - {{ booking.schedule.getHours() }} : {{ booking.schedule.getMinutes() }}</v-row>
        </v-col>
        <v-col cols="10" sm="8" class="flex" align="center">
          <v-row dense>
            <h3>{{ booking.company_name }}</h3>
          </v-row>
          <v-row dense>{{ booking.company_address }} - {{booking.company_city}}</v-row>
        </v-col>
        <v-col cols="2" sm="2" align="center">
          <v-row justify="center">
            <v-btn icon @click="deleteBooking">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    booking: {
      type: Object,
      required: true
    }
  },
  methods: {
    deleteBooking() {
      this.$store.dispatch("deleteBooking", this.booking);
    }
  }
};
</script>
