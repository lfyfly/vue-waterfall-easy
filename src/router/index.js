import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/test',
      name: 'test',
      component: { name: 'test',template:'<h1>test test test test test test</h1>'}
    },
  ]
})
