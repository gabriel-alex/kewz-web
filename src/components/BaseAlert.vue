<template>
  <v-alert dense outlined :type="alertobj.type" transition="scale-transition">
    <v-row align="center" justify="center">
      <v-col class="grow">{{alertobj.msg}}</v-col>
      <v-col class="shrink">
        <v-btn icon @click="removeToast">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  name: "Alert",
  props: {
    alertobj: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeToast(id) {
      this.$store.dispatch("deleteAlert", id);
    }
  },
  mounted() {
    var duration = 4000;
    if (this.alertobj.duration) {
      duration = this.alertobj.duration;
    }
    setTimeout(() => {
      this.removeToast(this.alertobj.id);
    }, duration);
  }
};
</script>