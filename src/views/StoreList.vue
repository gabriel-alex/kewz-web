<template>
    <v-container>
        <v-row>
            <v-col cols="12" lg="3" md="4" sm="6" v-for="store in stores" :key="`store-${store.id}`">
                <StoreCard1 :store=store></StoreCard1>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import StoreCard1 from "../components/StoreCard1";

export default {
    components: {
        StoreCard1,
    },
    computed:{
        stores: function(){
            return this.$store.getters.companies
        }
    },
    methods:{
        getcompanies(){
            this.$store.dispatch("getCompanies")
        }
    },
    beforeMount(){
    this.getcompanies()
 },
}
</script>