<template>
  <v-container>
    <v-img height="200" v-if="store && store.image" :src="store.image" />
    <v-img height="200" v-else src="@/assets/missing_image.png" />
    <div v-if="store">
    <v-row primary lighten-1>
      <v-col>
        <h1>{{ store.name}}</h1>
      </v-col>
    </v-row>
    <v-row color="primary lighten-2">
      <v-col cols="1">
        <v-icon>mdi-map-marker</v-icon>
      </v-col>
      <v-col>
        <h3>{{ store.address}}, {{ store.city}}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-form ref="BookingForm" v-model="formValidity">
          <v-dialog v-model="dialog" max-width="300px">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-on="on"
                prepend-icon="mdi-calendar"
                label="Date"
                v-model="dateFormatted"
                readonly
              ></v-text-field>
            </template>

            <v-card justify="center" align="center">
              <v-date-picker locale="fr-fr" v-model="date"></v-date-picker>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-select
            prepend-icon="mdi-clock-outline"
            item-value="value"
            item-text="display"
            :items="schedule_list"
            v-model="bookedTime"
            label="Heure"
          ></v-select>
          <v-btn color="primary" @click="book" :disabled="!formValidity">Reserver</v-btn>
        </v-form>
      </v-col>
    </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col>
          <Spinner size="large"></Spinner>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      bookedTime: null,
      dialog: false,
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      formValidity: false,
      client_mean_time: 20,
      client_max: 3,
      opening_hour: 10,
      opening_minute: 30,
      closing_hour: 18,
      closing_minute: 30,
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    loadStoreData(id) {
      this.$store.dispatch("getCompany", id);
    },
    book() {
      this.$store.dispatch("addBooking", {
        company: this.id,
        time: this.bookedTime
      });
    },
    generateTime() {}
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    }
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    store: function() {
      return this.$store.getters.company;
    },
    schedule_list: function() {
      var list = [];
      
      const [year, month, day] = this.date.split("-");
      var init = new Date(year, month, day);
      init.setUTCMinutes(this.opening_minute);
      init.setUTCHours(this.opening_hour);

      var end = new Date(year, month, day);
      end.setUTCMinutes(this.closing_minute);
      end.setUTCHours(this.closing_hour);
      
      var span_time = this.client_mean_time*60*1000;

      var temp = new Date(init.getTime());
      do {
        var schedule = {
        disabled: false,
        value: temp.getTime(),
        display: `${temp.getHours()}:${temp.getMinutes()}` 
      };
        list.push(schedule);

        temp.setTime(temp.getTime() + span_time) ;
      } while (temp.getTime() < end.getTime());
      return list;
    }
  },
  beforeMount() {
    this.loadStoreData(this.id);
  }
};
</script>