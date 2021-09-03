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


function animate(id, er){
  document.getElementById(id).style.animation = "error 0.5s ease-in-out";
  document.getElementById(id).style.border = "solid 1px red";
  document.getElementById(er).style.display = "inline";
}

function reset(){
  let f = document.getElementById("fName");
  let l = document.getElementById("lName");
  let e = document.getElementById("email");
  let p = document.getElementById("password");
  let c = document.getElementById("cpass");
  
  f.style.animation = "";
  f.style.border = "0px";
  l.style.animation = "";
  l.style.border = "0px";
  e.style.animation = "";
  e.style.border = "0px";
  p.style.animation = "";
  p.style.border = "0px";
  c.style.animation = "";
  c.style.border = "0px";
  document.getElementById("first_name").style.display = "none";
  document.getElementById("last_name").style.display = "none";
  document.getElementById("mail").style.display = "none";
  document.getElementById("pass").style.display = "none";
  document.getElementById("cPass").style.display = "none";
  document.getElementById("all").style.display = "none";
  document.getElementById("pass").innerHTML = "";
}

function empty(fName, lName, pass, cPass, email) {
  document.getElementById("all").innerHTML = "<p>All fields are required</p>";
  if (fName == null)
    animate("fName", "all");
  if (lName == null)
    animate("lName", "all");
  if (email == null)
    animate("email", "all");
  if (pass == null)
    animate("password", "all");
  if (cPass == null)
    animate("cpass", "all");
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function check(pass, fName, lName, email, cPass) {
  let res = false;

  if (!(/^[a-zA-Z]+$/.test(fName)))
  {
    animate("fName", "first_name");
    res= true;
  }
  if (!(/^[a-zA-Z]+$/.test(lName)))
  {
    animate("lName", "last_name");
    res= true;
  }
  if (pass.length < 6)
  {
    animate("password", "pass");
    document.getElementById("pass").innerHTML = "<p>Password must be greater than 6</p>";
    res= true;
  }
  if (!(/[a-z]/.test(pass) && /[A-Z]/.test(pass)))
  {
    animate("password", "pass");
    document.getElementById("pass").innerHTML += "<p>must contain at least one uppercase and one lowercase</p>";
    res= true;
  }
  if (!(/\d/.test(pass)))
  {
    animate("password", "pass");
    document.getElementById("pass").innerHTML += "<p>must contain at least one number</p>";
    res= true;
  }
  if (!validateEmail(email))
  {
    document.getElementById("mail").innerHTML = "<p>Invalid email format</p>";
    animate("email", "mail");
    res= true;
  }
  if (cPass != pass)
  {
    animate("cpass", "cPass");
    res= true;
  }
  return (res);
}


new Vue({
  el: '#log',
  data: {
      err: '',
      email: null,
      pass: null
  },
  methods: {
    log: function (event) {
      event.preventDefault();
      if (this.email == null || this.email == "")
      {
        this.err = "Both fields required"
        animate("logMail", "logErr");
      }
      if (this.pass == null || this.pass == "")
      {
        this.err = "Both fields required"
        animate("logPass", "logErr");
        return ;
      }
      if (!validateEmail(this.email))
      {
        this.err = "invalid email";
        animate("logMail", "logErr");
        return ;
      }
      const info = { "email": this.email, "password": this.pass};
      console.log(info);
  axios.post("http://192.168.1.104:3000/users/login", info)
  .then(response => { 
    this.err=response.data;
    console.log(response);
  })
  .catch(error => {
    this.err = "Wrong email or password";
    animate("logMail", "logErr");
    animate("logPass", "logErr");
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
      err: [],
      fName: null,
      lName: null,
      pass: null,
      cPass: null,
      email: null
  },
  methods: {
    reg: function (event) {
      event.preventDefault();
      reset();
      if (this.fName == null || this.lName == null || this.pass == null || this.cPass == null || this.email == null)
        return empty(this.fName, this.lName, this.pass, this.cPass, this.email);
      if (check(this.pass, this.fName, this.lName, this.email, this.cPass))
        return ;
      const info = { "first_name": this.fName, "last_name": this.lName, "password": this.pass, "email": this.email};
      console.log(info);
  axios.post("http://192.168.1.104:3000/users", info)
  .then(response => { 
    this.err=response.data;
  })
  .catch(error => {
      if (error.response.status == 422)
      {
        document.getElementById("mail").innerHTML = "<p>Email already in use</p>";
        animate("email", "mail");
      }
      else
      {
        document.getElementById("all").innerHTML = "<p>Registration Failed</p>";
        document.getElementById("all").style.display = "inline";
      }
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