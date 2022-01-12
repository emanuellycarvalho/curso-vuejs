import Vue from 'vue'
import Router from 'vue-router'
import GitIssue from '@/components/GitIssue'
import GitIssues from '@/components/GitIssues'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GitIssues',
      component: GitIssues
    },

    {
      path: '/:user/:repo/:issue',
      name: 'GitIssue',
      component: GitIssue
    }
  ]
})
