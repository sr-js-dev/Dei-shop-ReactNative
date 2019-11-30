import { LoginManager, AccessToken } from 'react-native-fbsdk';

export function loginWithFacebook() {
  return new Promise((resolve, reject) => {
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function(result) {
        console.log(result);
        if (result.isCancelled) {
          reject({ reason: 'Cancelled' });
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            console.log(data);
            const token = data.accessToken.toString();
            const fbInfo = {
              email: '',
              password: '',
              social_type: 'Facebook',
              social_id: data.userID,
              social_token: data.accessToken.toString()
            };
            console.log(fbInfo);
            resolve(fbInfo);

            // fetch(
            //   'https://graph.facebook.com/v3.0/me?fields=name,first_name,last_name,gender,email,verified,link&access_token=' +
            //     token
            // )
            //   .then(response => response.json())
            //   .then(user => {
            //     console.log(user);
            //     resolve(fbInfo);
            //   })
            //   .catch(err => {
            //     reject({ reason: 'Error' });
            //   });
          });
        }
      },
      function(error) {
        console.log(error);
        reject(error);
      }
    );
  });
}
