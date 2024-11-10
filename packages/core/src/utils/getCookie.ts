export default async function (event: any, key: string) {
  return event?.cookies?.find((cookie: string) => cookie.split("=")[0] === key);
}
