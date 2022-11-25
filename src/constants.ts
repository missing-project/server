interface EndPointInterface {
  index: string;
  user: string;
  guest: string;
}

export const endPoint: EndPointInterface = {
  index: '/',
  user: '/user',
  guest: '/guest',
};
