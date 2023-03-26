function validateEmail(){
  let emailId=document.getElementById("email").value;
   if(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(emailId)==false){
     document.getElementById("errorEmail").innerHTML="Please enter valid email ";
     return false;
   }else{
     document.getElementById("errorEmail").innerHTML="";
     return true;
   }
 }
 function validateName(){
   let name=document.getElementById("name").value;
    if(name ==""){
     document.getElementById("errorName").innerHTML="please enter name";
     return false
      }else if(/(^[a-zA-Z][a-zA-Z\s]{1,20}[a-zA-Z]$)/.test(name)==false){
        document.getElementById("errorName").innerHTML="please enter a valid name";
      }else{
       document.getElementById("errorName").innerHTML="";
         return true 
      }
 }
 function validatePassword(){
   let password=document.getElementById("password").value;
   if(password.length <6){
     document.getElementById("errorPassword").innerHTML="please enter valid password";
     return false

   }else{
     document.getElementById("errorPassword").innerHTML="";
     return true;
   }
 }

 function validateNumber(){
   let number=document.getElementById("number").value;
    if(/^[0-9]+$/.test(number)==false){
     document.getElementById("errorNumber").innerHTML="please enter a valid number";
     return false
    }
   else if(number.length != 10){
     document.getElementById("errorNumber").innerHTML="please enter 10 digits";
     return false
      }else{
       document.getElementById("errorNumber").innerHTML="";
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
 function loginEmail(){
  let emailId=document.getElementById("Email").value;
   if(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(emailId)==false){
     document.getElementById("errEmail").innerHTML="Please enter valid email ";
     return false;
   }else{
     document.getElementById("errEmail").innerHTML="";
     return true;
   }
 }
 function loginPassword(){
  let password=document.getElementById("Password").value;
  if(password.length <6){
    document.getElementById("errPassword").innerHTML="*please enter valid password";
    return false

  }else{
    document.getElementById("errPassword").innerHTML="";
    return true;
  }
}
 function login(){
  loginEmail()
  loginPassword()
   if(loginEmail()&&loginPassword()){
     return true
   }else{
     return false
   }
 }

 function validatefEmail(){
  let emailId=document.getElementById("fEmail")
   if(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(emailId.value)==false){
     document.getElementById("errorfEmail").innerHTML="*Please enter valid email ";
     return false;
   }else{
     document.getElementById("errorfEmail").innerHTML="";
     return true;
   }
 }
 
 function validatefNumber(){
  let number=document.getElementById("fNumber")
   if(/^[0-9]+$/.test(number.value)==false){
    document.getElementById("errorfNumber").innerHTML="*please enter a valid number";
    return false
   }
  else if(number.value.length != 10){
    document.getElementById("errorfNumber").innerHTML="please enter 10 digits";
    return false
     }else{
      document.getElementById("errorfNumber").innerHTML="";
        return true
     } 
    }   

function forget(){
  if(validatefNumber()||validatefEmail()){
    return true
  }else{
    return false
  }
}

function enable(){
  $('.inputDisabled').prop("disabled", false);
}
