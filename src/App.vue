<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <h1>Kewz</h1>

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <div v-if="$vuetify.breakpoint.mdAndUp && !logged" >
        <v-btn 
          v-for="link in links"
          :key="`${link.label}-header-link`"
          text
          rounded
          :to="{ name: link.name }"
          class="mr-2"
        >
          {{ link.label }}
        </v-btn>
      </div>

      <div v-if="$vuetify.breakpoint.mdAndUp && logged" >
        <v-btn 
          v-for="link in links_logged"
          :key="`${link.label}-header-link`"
          text
          rounded
          :to="{ name: link.name }"
          class="mr-2"
        ><v-icon>{{ link.icon }}</v-icon>
          {{ link.label }}
        </v-btn>
      </div>

    </v-app-bar>

    <v-content>
      <v-navigation-drawer v-model="drawer" absolute temporary>

        <v-list dense v-if="!logged">
          <v-list-item
            v-for="link in links"
            :key="`${link.label}-drawer-item`"
            :to="{ name: link.name }"
            link
          >
            <v-list-item-content>
              <v-list-item-title>{{ link.label }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list dense v-if="logged">
          <v-list-item
            v-for="link in links_logged"
            :key="`${link.label}-drawer-item`"
            :to="{ name: link.name }"
            link
          >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ link.label }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <router-view></router-view>
    </v-content>
    <v-footer color="primary lighten-1" padless>
      <v-layout justify-center wrap>
        <v-flex primary lighten-2 py-4 text-center white--text xs12>
          <strong>&copy; Kewz</strong> {{ new Date().getFullYear() }}  — <a href="https://github.com/gabriel-alex/kewz-web"><v-icon>mdi-github</v-icon></a>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
	name: 'App',
	data() {
		return {
      logged:false,
      drawer:false,
			links: [
				{
					label: 'Concept',
					name: 'home'
				},
				{
					label: 'Login',
					name: 'login'
				}
      ],
      links_logged: [
				{
          icon: 'mdi-store',
					label: 'Magasins',
					name: 'store'
        },
        {
          icon: 'mdi-notification-clear-all',
					label: 'Files d\'attente',
					name: 'queues'
				},
				{
          icon : 'mdi-account-cog-outline',
					label: 'Profil',
					name: 'userSettings'
				}
			]
		}
	}
}
</script>
