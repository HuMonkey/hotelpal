import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Lesson from '@/components/Lesson'
import Course from '@/components/Course'
import Bought from '@/components/Bought'
import Profile from '@/components/Profile'
import Jdbs from '@/components/Jdbs'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/lesson',
      name: 'Lesson',
      component: Lesson
    },
    {
      path: '/course',
      name: 'Course',
      component: Course
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/bought',
      name: 'Bought',
      component: Bought
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/jdbs',
      name: 'Jdbs',
      component: Jdbs
    }
  ]
})
