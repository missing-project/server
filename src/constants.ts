interface EndPointInterface {
  index: string;
  user: string;
  case: string;
  bookmark: string;
  guest: string;
}

export const endPoint: EndPointInterface = {
  index: '/',
  guest: '/guest',
  user: '/user',
  case: '/case',
  bookmark: '/bookmark',
};
