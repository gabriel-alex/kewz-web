<template>
    <v-container>
        <v-img src="../assets/logo-match.gif"></v-img>
        <v-row primary lighten-1>
            <v-col><h1>Nom du magasin</h1> {{ id}}</v-col>
        </v-row>
        <v-row color="primary lighten-2" >
            <v-col cols="1"><v-icon>mdi-map-marker</v-icon></v-col>
            <v-col><h3>Adresse</h3></v-col>
            <!--<v-spacer></v-spacer>
            <v-btn icon></v-btn>-->
        </v-row>
        <v-row>
            <v-col>
            <v-form ref="BookingForm" v-model="formValidity">
                <v-select prepend-icon="mdi-clock-outline" item-value="value"
    item-text="display" :items="hours" label="Heure"></v-select>
                <v-dialog v-model="dialog" max-width="300px" >
                    
                    <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" prepend-icon="mdi-calendar" label="Date" v-model="dateFormatted" readonly></v-text-field>
                    
                    </template>
                    
                    <v-card justify="center" align="center">
                        <v-date-picker locale="fr-fr" v-model="date"></v-date-picker>
                        
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="dialog = false">
                                OK
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-btn type="submit" color="primary" :disabled="!formValidity">Reserver</v-btn>
            </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: ['id'],
    data (){
        return{
            dialog:"",
            date:new Date().toISOString().substr(0, 10),
            dateFormatted:this.formatDate(new Date().toISOString().substr(0, 10)),
            formValidity: false,
            store: {},
            items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
            hours: [
                {
    "disabled": true, // change
    "value": 0,
    "display": "12:00 AM"
  },
  {
    "disabled": false, // change
    "value": 1,
    "display": "12:30 AM"
  },
  {
    "disabled": false, // change
    "value": 2,
    "display": "1:00 AM"
  },
            ]
        }
    },
    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
    },
    watch: {
      date () {
        this.dateFormatted = this.formatDate(this.date)
      },
    },
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
    },
}
</script>