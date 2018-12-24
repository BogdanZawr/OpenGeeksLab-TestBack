import UserWrite from './model/write/user';

const firstExtraTaskInfo = async () => {
  const res = await UserWrite.findByRoles('user');
  if (!res) {
    await UserWrite.insertRow({
      data: {
        email: 'bogdan9712345@gmail.com',
        password: 'admin',
        firstName: 'admin',
        lastName: 'admin',
        roles: ['admin'],
      },
    });
    console.log('CreateAdmin');
  }
};

export default async () => {
  try {
    await firstExtraTaskInfo();
  } catch (err) {
    console.log(err);
  }
};
