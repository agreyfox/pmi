import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Setup from '@/components/Setup'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/setup',
      name: 'setup',
      component: Setup
    }
  ]
})
