export const getCityIO = URL =>
    fetch(URL)
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(e => {
            console.log(e);
        });
