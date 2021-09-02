// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import './assets/styles.css';


/*Vue.config.productionTip = false
new Vue({
  el: '#users',
  data () {
    return {
      info: null
    }
  },
  mounted () {
    axios
      .get('http://192.168.1.104:3000/users')
      .then(response=>{this.info =response.data})
  }

})*/

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
      const info = { "email": this.name, "password": this.pass};
      console.log(info);
  axios.post("http://192.168.1.104:3000/users/login", info)
  .then(response => { 
    this.err=response.data;
  })
  .catch(error => {
      this.err= error.response.data;
  });
  },
  swipeR: function (event) {
    var o = document.getElementById("log");
    var l = document.getElementById("one");
    var r = document.getElementById("two");
    var t = document.getElementById("reg");
    var a = document.getElementById("l");
    var b = document.getElementById("r");
    
    o.style.animation = "swipe1 1s ease-in-out"
    setTimeout(function(){
    l.style.animation = "scale2 0.5s ease-in-out"
  }, 300);
    setTimeout(function(){
      a.style.zIndex = "-1";
      b.style.zIndex = "100";
      o.style.animation = ""
      r.style.animation = "scale1 1s ease-in-out"
  }, 800);
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
  axios.post("http://192.168.1.104:3000/users", info)
  .then(response => { 
    this.err=response.data;
  })
  .catch(error => {
      this.err= error.response.data;
  });
  },
  swipeL: function (event) {
    var t = document.getElementById("reg");
    var r = document.getElementById("two");
    var l = document.getElementById("one");
    var o = document.getElementById("log");
    var a = document.getElementById("l");
    var b = document.getElementById("r");

    t.style.animation = "swipe2 1s ease-in-out"
    setTimeout(function(){
      r.style.animation = "scale2 0.5s ease-in-out"
  }, 300);
    setTimeout(function(){
      b.style.zIndex = "-1";
      a.style.zIndex = "100";
      t.style.animation = ""
      l.style.animation = "scale1 1s ease-in-out"
  }, 800);
}
}})