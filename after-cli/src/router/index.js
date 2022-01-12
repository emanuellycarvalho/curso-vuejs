import Vue from 'vue';
import Router from 'vue-router';
import GitIssues from '@/components/GitIssues';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: GitIssues,
    },
  ],
});
