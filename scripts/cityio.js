import "babel-polyfill";

/**
 * get cityIO method [uses polyfill]
 * @param cityIOtableURL cityIO API endpoint URL
 */
export async function getCityIO(url) {
  return fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      return data;
    })
    .catch(err => {
      console.log("Error:", err);
    });
}

export async function postCityIO(url, data) {
  const rawResponse = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data)
  });
  const content = await rawResponse.json();
  console.log("cityIO post:", content.status);
}
