  function validateEmail(){
   let emailId=document.getElementById("email").value;
    if(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(emailId)==false){
      document.getElementById("errEmail").innerHTML="Please enter valid email ";
      return false;
    }else{
      document.getElementById("errEmail").innerHTML="";
      return true;
    }
  }
  function validateName(){
    let name=document.getElementById("name").value;
     if(name ==""){
      document.getElementById("errName").innerHTML="please enter name";
      return false
       }else{
        document.getElementById("errName").innerHTML="";
          return true
       }
  }
  function validatePassword(){
    let password=document.getElementById("password").value;
    if(password.length <6){
      document.getElementById("errPassword").innerHTML="please enter valid password";
      return false

    }else{
      document.getElementById("errPassword").innerHTML="";
      return true;
    }
  }

  function validateNumber(){
    let number=document.getElementById("number").value;
     if(/^[0-9]+$/.test(number)==false){
      document.getElementById("errNumber").innerHTML="please enter a valid number";
      return false
     }
    else if(number.length != 10){
      document.getElementById("errNumber").innerHTML="please enter 10 digits";
      return false
       }else{
        document.getElementById("errNumber").innerHTML="";
          return true
       }
  }
  function confirmPassword(){
    let password2=document.getElementById("password2").value;
    console.log(password2)
     if(password2 != password || password2==""){
      document.getElementById("Password2").innerHTML="Password not match";
      return false
       }else{
        document.getElementById("Password2").innerHTML="";
        return true
       }
      }
  function validateSignup(){
    if(validateEmail()&&validateName()&&validatePassword()&&validateNumber()){
      return true
    }else{
      return false
    }
  }




  function login(){
    if(validateEmail()&&validatePassword()){
      return true
    }else{
      return false
    }
  }