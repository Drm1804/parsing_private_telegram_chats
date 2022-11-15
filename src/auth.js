const {code, phone, password} = require('../config');
const api = require('./api')

async function getUser() {
  try {
    const user = await api.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}


function sendCode(phone) {
  return api.call('auth.sendCode', {
    phone_number: phone,
    settings: {
      _: 'codeSettings',
    },
  });
}

function signIn({ code, phone, phone_code_hash }) {
  return api.call('auth.signIn', {
    phone_code: code,
    phone_number: phone,
    phone_code_hash: phone_code_hash,
  });
}
function signUp({ phone, phone_code_hash }) {
  return api.call('auth.signUp', {
    phone_number: phone,
    phone_code_hash: phone_code_hash,
    first_name: 'MTProto',
    last_name: 'Core',
  });
}

function getPassword() {
  return api.call('account.getPassword');
}

function checkPassword({ srp_id, A, M1 }) {
  return api.call('auth.checkPassword', {
    password: {
      _: 'inputCheckPasswordSRP',
      srp_id,
      A,
      M1,
    },
  });
}


const auth = async () => {
  const user = await getUser();

  if (!user) {
    const { phone_code_hash } = await sendCode(phone);

    try {
      const signInResult = await signIn({
        code,
        phone,
        phone_code_hash,
      });

      if (signInResult._ === 'auth.authorizationSignUpRequired') {
        await signUp({
          phone,
          phone_code_hash,
        });
      }
    } catch (error) {
      if (error.error_message !== 'SESSION_PASSWORD_NEEDED') {
        console.log(`error:`, error);

        return;
      }

      // 2FA

      const { srp_id, current_algo, srp_B } = await getPassword();
      const { g, p, salt1, salt2 } = current_algo;

      const { A, M1 } = await api.mtproto.crypto.getSRPParams({
        g,
        p,
        salt1,
        salt2,
        gB: srp_B,
        password,
      });

      const checkPasswordResult = await checkPassword({ srp_id, A, M1 });
    }
  }
};


module.exports = auth