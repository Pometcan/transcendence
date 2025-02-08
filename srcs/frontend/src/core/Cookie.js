function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function checkCookie(name) {
    var cookie = getCookie(name);
    if (cookie != null) {
        return true;
    }
    return false;
}

function listCookies() {
    var theCookies = document.cookie.split(';');
    var aString = '';
    for (var i = 1 ; i <= theCookies.length; i++) {
        aString += i + ' ' + theCookies[i-1] + "\n";
    }
    return aString;
}

async function getCsrfToken () {
  const response = await fetch(`https://${window.location.host}/api/auth/csrf/`, { // await eklendi
          method: "GET",
          credentials: "include",
          headers: {
              Accept: "application/json",
          },
      });
      const data = await response.json();
      setCookie('csrftoken', data.csrfToken, 1);
      return data.csrfToken;
}

export { setCookie, getCookie, eraseCookie, checkCookie, listCookies, getCsrfToken };
