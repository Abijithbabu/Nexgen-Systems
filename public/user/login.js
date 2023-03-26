const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
    document.getElementById('msg1').innerHTML = ''
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
    document.getElementById('msg2').innerHTML = ''
});
function tab1() {
    document.getElementById('vNum').style.display='none'
    document.getElementById('errorfNumber').style.display='none'
    document.getElementById('btn2').style.display='none'
    document.getElementById('vEmail').removeAttribute("style")
    document.getElementById('errorfEmail').style.display='block'
    document.getElementById('btn1').style.display='block'
}
function tab2() {
    document.getElementById('vEmail').style.display='none'
    document.getElementById('errorfEmail').style.display='none'
    document.getElementById('btn1').style.display='none'
    document.getElementById('vNum').removeAttribute("style")
    document.getElementById('errorfNumber').style.display='block'
    document.getElementById('btn2').style.display='block'
}

function toggle(x) {
    const container = document.getElementById('sign-in')
    if (x) {
        container.innerHTML = `
    <h2 class="title">Reset Password</h2>
    <h5>provide any known credentials to recover your account</h5>
    <br>
    <div>
        <a href='#' onclick='tab1()' style="text-decoration: none;" >Email</a> / 
        <a href='#' onclick='tab2()' style="text-decoration: none;" >Phone</a>
    </div>
    <br>
    <div id='vEmail' class="input-field">
        <i class="fas fa-user"></i>
        <input type="text" placeholder="Email"  name="femail" id="fEmail" onkeyup="validatefEmail()" />
    </div>
    <span id="errorfEmail"></span>
    <div id='vNum' class="input-field" style='display:none'>
        <i class="fas fa-phone"></i>
        <input type="text"  placeholder="mobile no"  name="fphone" id="fNumber" onkeyup="validatefNumber()" />
    </div>
    <span id="errorfNumber" style='display:none'></span><br>
    <h6>*by confirming otp will be sent to your registered phone number </h6>
    <button type="button" id='btn1' class="btn solid" onclick="validatefEmail(),sendOtp('fEmail')">SEND OTP</button>
    <button type="button" id='btn2' style='display:none' class="btn solid" onclick="validatefNumber(),sendOtp('fNumber')">SEND OTP</button><br>
    <a href='#' onclick='toggle(0)' style="text-decoration: none;" >Back to Sign In</a>
    <span id="msg2" style="color: crimson; padding-top: 20px;"></span>`
    } else {
        container.innerHTML = `
    <h2 class="title">Sign in</h2>
    <div class="input-field">
        <i class="fas fa-user"></i>
        <input id="Email" type="text" placeholder="Email" name="email" onkeyup="loginEmail()" />
    </div>
    <span id="errEmail"></span>
    <div class="input-field">
        <i class="fas fa-lock"></i>
        <input type="password" id="Password" placeholder="Password" name="password" onkeyup="loginPassword()" />
    </div>
    <span id="errPassword"></span>
    <button type="submit" class="btn solid" onclick="verify()">Login</button>
    <a href='#' onclick="toggle(1)" style="text-decoration: none;" class="forgot">Forgot your password?</a>
    <span id="msg2" style="color: crimson; padding-top: 20px;"></span>`
    document.getElementById('msg2').innerHTML = ''
    }
}
function verify(){
if(login()){  
      data = { email:document.getElementById('Email').value,
         password:document.getElementById('Password').value }
  axios.post('/login', data)
  .then(res => {
  if(res.data.message){   
    document.getElementById('msg2').innerHTML = res.data.message  
  }else{location.reload()}
  })
  .catch(error => console.log(error))
  }
}
let OTP
function sendOtp(id){
    if(forget()){  
        data = { data:document.getElementById(id).value }
        axios.post('/forget', data)
        .then(res => {
            if(res.data.user){ 
                OTP = res.data.otp  
                timer()
                document.getElementById('sign-in').innerHTML = `
    <h2 class="title">Reset Password</h2>
    <h5>OTP has been send to registered Phone number +91 ${res.data.user.mobile}</h5>
    <br>
    <div class="social-media">
        <a href="#" class="social-icon">
            <input class='otp' type="text" id='otp1' maxlength="1" onkeyup="clickEvent(event,this,2)">
        </a>
        <a href="#" class="social-icon">
            <input class='otp' type="text" id="otp2" maxlength="1" onkeyup="clickEvent(event,this,3)">
        </a>
        <a href="#" class="social-icon">
            <input class='otp' type="text" id="otp3" maxlength="1" onkeyup="clickEvent(event,this,4)">
        </a>
        <a href="#" class="social-icon">
            <input class='otp' type="text" id="otp4" maxlength="1" onkeyup='verifyOtp(),clickEvent(event,this,5)'>
        </a>
    </div>
    <br><span id="errOTP" ></span><br>
    <p id='timer'></p><a href='#' id='resend' onclick="resendOtp()" style="text-decoration: none;display:none" class="forgot">Resend OTP</a>
    <button type="button" id='btn3' class="btn solid" onclick="verifyOtp()">VERIFY OTP</button>
    <div class="input-field" id='div1' style='display:none' >
        <i class="fas fa-lock"></i>
        <input type="password" id="newPassword" placeholder="Enter New Password" />
    </div>
    <span id='newErr'></span>
    <div class="input-field" id='div2' style='display:none'>
        <i class="fas fa-lock"></i>
        <input type="password" id="rePassword" placeholder="Re-type Password" />
    </div>
    <span id='reErr'></span>
    <button type="button" id='btn4' style='display:none' class=" btn solid" onclick="resetPassword()">SAVE CHANGES</button><br>
    <span id="msg3" style="color: crimson; padding-top: 20px;"></span>`
}else{
    document.getElementById('msg2').innerHTML = 'Sorry, Couldnt find a match in our records !'  
}
})
.catch(error => console.log(error))
}
}
function clickEvent(event,first,last){
    if(first.value.length&&last!=5){
        document.getElementById('otp'+last).focus()
    } else if (event.keyCode === 8 || event.which === 8) { 
        document.getElementById('otp'+(last-2)).focus()
    }
}

let block
function verifyOtp(){
let newOtp =''  
for(i=1;i<=4;i++){
    newOtp += document.getElementById('otp'+i).value
}
const otp = parseInt(newOtp)
if(newOtp.length==4){
   if(otp==OTP){
    document.getElementById('errOTP').innerHTML=`<span style='color:green'>&#10003;&nbsp;Verified</span>`
    document.getElementById('btn3').style.display='none'
    document.getElementById('div1').removeAttribute("style")
    document.getElementById('div2').removeAttribute("style")
    document.getElementById('btn4').removeAttribute("style")
    document.getElementById("resend").style.display = 'none'
    document.getElementById('timer').style.display = 'none'
    block = true
   var otpElements = document.getElementsByClassName('otp');
   for (var i = 0; i < otpElements.length; i++) {
   otpElements[i].setAttribute('disabled', true);
   }
   }else{
    document.getElementById('errOTP').innerHTML='OTP verification failed, Incorrect OTP !' 
   }
}else{
   document.getElementById('errOTP').innerHTML='please enter 4-digits'  
}
}
function resetPassword(){
    if(newPassword()&&rePassword()){
    data = {password:document.getElementById('rePassword').value}
    axios.post('/resetPassword', data)
    .then(res => {
    if(res.data.state){   
      toggle(0) 
      document.getElementById('msg2').innerHTML ='<p style="color:green" class="text-center mb-0 text-success">Password Changed Successfully...!</p>'
    } 
    })
    .catch(error => console.log(error))
    }
}
function timer() {
    block = false
    var sec = 60;
    var timer = setInterval(function () {
        document.getElementById('timer').innerHTML = 'resend otp in 00:' + sec;
        sec--;
        if (sec < 0) {
            clearInterval(timer);
            document.getElementById('timer').innerHTML = '';
            if(block==false){
            document.getElementById("resend").style.display = 'block';
        }}
    }, 1000);
}

function resendOtp(){
    timer()
    document.getElementById("resend").style.display = 'none'
    axios.get('/resendOtp')
    .then(res => {
    OTP = res.data.otp
    })
    .catch(error => console.log(error))
}
function newPassword(){
    let password=document.getElementById("newPassword").value;
    if(password.length <6){
      document.getElementById("newErr").innerHTML="*please enter a valid password";
      return false
    }else{
      document.getElementById("newErr").innerHTML="";
      return true;
    }
  }
function rePassword(){
    let password=document.getElementById("rePassword").value;
    if(password == document.getElementById("newPassword").value){
      document.getElementById("reErr").innerHTML="";
      return true;
    }else{
      document.getElementById("reErr").innerHTML="*passwords doesn't match !";
      return false
    }
}
function loadOtp(){
    validateEmail()
    validateName()
    validatePassword()
    validateNumber()
    if(validateSignup()){
         data = {
             name: document.getElementById('name').value ,
             email:document.getElementById('email').value,
             phone:document.getElementById('number').value,
             password:document.getElementById('password').value
          }
        axios.post('/register', data)
        .then(res => {
        if(res.data.otp){   
            OTP = res.data.otp  
            timer()
            document.getElementById('sign-up').innerHTML = `
<h2 class="title">Verify OTP</h2>
<h5>OTP has been send to registered Phone number +91 ${document.getElementById('number').value}</h5>
<br>
<div class="social-media">
    <a href="#" class="social-icon">
        <input class='otp' type="text" id='otp1' maxlength="1" onkeyup="clickEvent(event,this,2)">
    </a>
    <a href="#" class="social-icon">
        <input class='otp' type="text" id="otp2" maxlength="1" onkeyup="clickEvent(event,this,3)">
    </a>
    <a href="#" class="social-icon">
        <input class='otp' type="text" id="otp3" maxlength="1" onkeyup="clickEvent(event,this,4)">
    </a>
    <a href="#" class="social-icon">
        <input class='otp' type="text" id="otp4" maxlength="1" onkeyup=' verifyOTP(),clickEvent(event,this,5)'>
    </a>
</div>
<br><span id="errOTP" ></span><br>
<p id='timer'></p><a href='#' id='resend' onclick="resendOtp()" style="text-decoration: none;display:none" class="forgot">Resend OTP</a>
<button type="button" class="btn solid" onclick=" verifyOTP()">VERIFY OTP</button><br>
<a href='/' id='redir'style="text-decoration: none;" class="forgot"></a>
<span id="msg4" style="color: crimson; padding-top: 20px;"></span>` 
        }else{  
          document.getElementById('msg1').innerHTML = 'user already exists'
        } 
        })
        .catch(error => console.log(error))
        }  
}

function verifyOTP(){
    let newOtp =''  
    for(i=1;i<=4;i++){
        newOtp += document.getElementById('otp'+i).value
    }
    const otp = parseInt(newOtp)
    if(newOtp.length==4){
       if(otp==OTP){
        document.getElementById('errOTP').innerHTML=`<span style='color:green'>&#10003;&nbsp;Verified</span>`
        document.getElementById("resend").style.display = 'none'
        document.getElementById('timer').style.display = 'none'
        block = true
       var otpElements = document.getElementsByClassName('otp');
       for (var i = 0; i < otpElements.length; i++) {
       otpElements[i].setAttribute('disabled', true);
       }
       axios.get('/verifyOtp')
       .then(res => {
        if(res.data.status){
            var sec = 5;
            var timer = setInterval(function () {
            document.getElementById('redir').innerHTML = 'redirecting in 00:' + sec+' sec';
            sec--;
            if (sec < 0) {
                 clearInterval(timer);
                 document.getElementById('redir').innerHTML = '';
                 document.getElementById('redir').click()
            }
         }, 1000)}
        else{
            document.getElementById('msg4').innerHTML= 'something went wrong ! registration failed.' 
        } 
        })
       .catch(error => console.log(error))
       }else{
        document.getElementById('errOTP').innerHTML='OTP verification failed, Incorrect OTP !' 
       }
    }else{
       document.getElementById('errOTP').innerHTML='please enter 4-digits'  
    }
}