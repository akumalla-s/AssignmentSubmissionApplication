export default function ajax(url, requestMethod, jwt, requestBody, fetchReq) {
  const fetchData = {
    headers: {
      "Content-Type": "application/json",
    },
    method: requestMethod,
  };

  if (jwt) {
    fetchData.headers.Authorization = `Bearer ${jwt}`;
  }

  if (requestBody) {
    fetchData.body = JSON.stringify(requestBody);
  }
  return fetch(url, fetchData).then((response) => {
    if(fetchReq === "loginRequest"){
      if (response.status === 200) {
          return Promise.all([response.json(), response.headers]);
        }else{
          return Promise.reject("Invalid login attempt");
        }
    }
    if (response.status === 200) return response.json();
  });
}
