window.onload = function(){
  var submit = document.getElementById('submit');
  submit.onclick = verify;
};
function verify(){
    alert('functioning!');
  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(request.readyState === XMLHttpRequest.DONE){
      if(request.status === 200){
        alert('Logged in successfully!');
      }else if(request.status === 403){
        alert('username/password incorrect');
      }else if(request.status === 500){
        alert('something went wrong on the server!');
      }
    }
  };
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  console.log(username);
  console.log(password);
  request.open('POST', 'http://skscool.imad.hasura-app.io/login',true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send('username: username,password: password');
}