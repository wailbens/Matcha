// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#users',
  data () {
    return {
      info: null
    }
  },
  mounted () {
    axios
      .get('http://localhost:3000/users')
      .then(response=>{this.info =response.data})
  }

})

new Vue({
  el: '#log',
  data: {
      err: '',
      name: null,
      pass: null
  },
  methods: {
    log: function (event) {
      event.preventDefault();
      const info = { "username": this.name, "password": this.pass};
      console.log(info);
  axios.post("http://localhost:3000/users/login", info)
  .then(response => { 
    this.err=response.data;
  })
  .catch(error => {
      this.err= error.response.data;
  });
  }
}})

new Vue({
  el: '#reg',
  data: {
      err: '',
      name: null,
      pass: null,
      email: null
  },
  methods: {
    reg: function (event) {
      event.preventDefault();
      const info = { "username": this.name, "password": this.pass, "email": this.email};
      console.log(info);
  axios.post("http://localhost:3000/users", info)
  .then(response => { 
    this.err=response.data;
  })
  .catch(error => {
      this.err= error.response.data;
  });
  }
}})
