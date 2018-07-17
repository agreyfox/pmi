<template>
   <v-app id="App" dark>
    <!--v-navigation-drawer app></v-navigation-drawer-->
    <v-toolbar app dark flat>
      <v-toolbar-title>PMS</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click.native='setup'>设置</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
        <v-container fluid class="mt-0 pt-0">
          <router-view>
          </router-view>
        </v-container>
    </v-content>
    <v-footer app fixed>&copy; 2018</v-footer>
    </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created: function () {
  },
  mounted: function () {
    var vv = this
    let ready = this.$cookie.get('PMI')
    if (!ready) {
      vv.$router.push({name: 'setup'})
    } else {
      vv.$router.push({ name: 'main' })
    }
  },
  methods: {
    setup: function () {
      this.$router.push({name: 'setup'})
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
