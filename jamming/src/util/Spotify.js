 const clientId = '2ea906ab87b04f02b62aa7a3cd849762';
 const redirectUri = "http://localhost:3000";
 let accessToken;

 const Spotify =  {
     getAccessToken() {
         console.log(accessToken)
         if(accessToken) {
             return accessToken; 
         }

         const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
         const expireMatch = window.location.href.match(/expires_in=([^&]*)/);

         if(accessTokenMatch && expireMatch){
             accessToken = accessTokenMatch[1];

             const expiresIn = Number(expireMatch[1]);

             window.setTimeout(() => accessToken = '', expiresIn * 1000);
             window.history.pushState('Access Token', null, '/');
             return accessToken;
         }else{
             const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
             window.location = accessURL;
         }
     },

     search(term) {
         const accessToken = Spotify.getAccessToken();
          
         return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
             {
                 headers: { Authorization: `Bearer ${accessToken}` }
             }).then(response => {
                 return response.json()
             }).then(jsonResponse => {
                 if(!jsonResponse.tracks){
                     return []
                 }
                 return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }))
             })   
     }, 

     async savePlaylist(name, trackUris) {
         if(!name || trackUris.length){
             return
         }
         
         const accessToken  = Spotify.getAccessToken();
         const headers = { Authorization: `Bearer ${accessToken}`};
         let userId; 

         const response = await fetch('https://api.spotify.com/v1/me', { headers: headers });
         const jsonResponse = await response.json();
         userId = jsonResponse.id;
         const response_1 = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
             headers: headers,
             method: 'POST',
             body: JSON.stringify({ name: name })
         });
         const jsonResponse_1 = await response_1.json();
         const playlistId = jsonResponse_1.id;
         return await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
             headers: headers,
             method: 'POST',
             body: JSON.stringify({ uris: trackUris })
         });
     }
 };

 export default Spotify;